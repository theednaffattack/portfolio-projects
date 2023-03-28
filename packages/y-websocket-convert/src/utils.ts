import decoding from "lib0/decoding.js";
import encoding from "lib0/encoding.js";
import map from "lib0/map.js";
import debounce from "lodash.debounce";
import { IncomingMessage } from "node:http";
import awarenessProtocol from "y-protocols/awareness.js";
import syncProtocol from "y-protocols/sync.js";
import Y from "yjs";
import { LeveldbPersistence } from "y-leveldb";

import { callbackHandler, isCallbackSet } from "./callback";

// let envSchema = zod.object({
//   CALLBACK_DEBOUNCE_WAIT: zod.string().nonempty(),
//   CALLBACK_DEBOUNCE_MAXWAIT: zod.string().nonempty(),
// });

// let clientEnv = {
//   CALLBACK_DEBOUNCE_WAIT: process.env.CALLBACK_DEBOUNCE_WAIT,
//   GCALLBACK_DEBOUNCE_MAXWAIT: process.env.CALLBACK_DEBOUNCE_MAXWAIT,
// };

// let env = envSchema.parse(process.env);

// let config = { env };

const defaultDebounceMaxWait = 2000;

const CALLBACK_DEBOUNCE_WAIT = process.env.CALLBACK_DEBOUNCE_WAIT || 2000;
const CALLBACK_DEBOUNCE_MAXWAIT =
  process.env.CALLBACK_DEBOUNCE_MAXWAIT || 10000;

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;
const wsReadyStateClosing = 2; // eslint-disable-line
const wsReadyStateClosed = 3; // eslint-disable-line

// disable gc when using snapshots!
const gcEnabled = process.env.GC !== "false" && process.env.GC !== "0";
const persistenceDir = process.env.YPERSISTENCE;
/**
 * @type {{bindState: function(string,WSSharedDoc):void, writeState:function(string,WSSharedDoc):Promise<any>, provider: any}|null}
 */
let persistence: null | any = null;
if (typeof persistenceDir === "string") {
  console.info('Persisting documents to "' + persistenceDir + '"');
  // @ts-ignore

  const ldb = new LeveldbPersistence(persistenceDir);
  persistence = {
    provider: ldb,
    bindState: async (docName: string, ydoc: WSSharedDoc) => {
      const persistedYdoc = await ldb.getYDoc(docName);
      const newUpdates = Y.encodeStateAsUpdate(ydoc);
      ldb.storeUpdate(docName, newUpdates);
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
      ydoc.on("update", (update) => {
        ldb.storeUpdate(docName, update);
      });
    },
    writeState: async (docName: string, ydoc: WSSharedDoc) => {},
  };
}

/**
 * @param {{bindState: function(string,WSSharedDoc):void,
 * writeState:function(string,WSSharedDoc):Promise<any>,provider:any}|null} persistence_
 */
export function setPersistence(persistence_: any) {
  persistence = persistence_;
}

/**
 * @return {null|{bindState: function(string,WSSharedDoc):void,
 * writeState:function(string,WSSharedDoc):Promise<any>}|null} used persistence layer
 */
export function getPersistence() {
  return persistence;
}

/**
 * @type {Map<string,WSSharedDoc>}
 */
export const docs = new Map();
// exporting docs so that others can use it
// exports.docs = docs;

const messageSync = 0;
const messageAwareness = 1;
// const messageAuth = 2

/**
 * @param {Uint8Array} update
 * @param {any} origin
 * @param {WSSharedDoc} doc
 */
const updateHandler = (update: Uint8Array, origin: any, doc: WSSharedDoc) => {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeUpdate(encoder, update);
  const message = encoding.toUint8Array(encoder);
  doc.conns.forEach((_, conn) => send(doc, conn, message));
};

export class WSSharedDoc extends Y.Doc {
  /**
   * The Awareness class implements a simple shared state protocol that can be used for non-persistent data like awareness information
   * (cursor, username, status, ..). Each client can update its own local state and listen to state changes of
   * remote clients. Every client may set a state of a remote peer to `null` to mark the client as offline.
   *
   * Each client is identified by a unique client id (something we borrow from `doc.clientID`). A client can override
   * its own state by propagating a message with an increasing timestamp (`clock`). If such a message is received, it is
   * applied if the known state of that client is older than the new state (`clock < newClock`). If a client thinks that
   * a remote client is offline, it may propagate a message with
   * `{ clock: currentClientClock, state: null, client: remoteClient }`. If such a
   * message is received, and the known clock of that client equals the received clock, it will override the state with `null`.
   *
   * Before a client disconnects, it should propagate a `null` state with an updated clock.
   *
   * Awareness states must be updated every 30 seconds. Otherwise the Awareness instance will delete the client state.
   *
   * @extends {Observable<string>}
   */
  awareness: awarenessProtocol.Awareness;
  conns: Map<any, any>;
  name: string;
  /**
   * @param {string} name
   */
  constructor(name: string) {
    super({ gc: gcEnabled });
    this.name = name;
    /**
     * Maps from conn to set of controlled user ids. Delete all user ids from awareness when this conn is closed
     * @type {Map<Object, Set<number>>}
     */
    this.conns = new Map();
    /**
     * @type {awarenessProtocol.Awareness}
     */
    this.awareness = new awarenessProtocol.Awareness(this);
    this.awareness.setLocalState(null);
    /**
     * @param {{ added: Array<number>, updated: Array<number>, removed: Array<number> }} changes
     * @param {Object | null} conn Origin is the connection that made the change
     */
    const awarenessChangeHandler = (
      {
        added,
        updated,
        removed,
      }: { added: number[]; updated: number[]; removed: number[] },
      conn: object | null
    ) => {
      const changedClients = added.concat(updated, removed);
      if (conn !== null) {
        const connControlledIDs =
          /** @type {Set<number>} */ this.conns.get(conn);
        if (connControlledIDs !== undefined) {
          added.forEach((clientID) => {
            connControlledIDs.add(clientID);
          });
          removed.forEach((clientID) => {
            connControlledIDs.delete(clientID);
          });
        }
      }
      // broadcast awareness update
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
      );
      const buff = encoding.toUint8Array(encoder);
      this.conns.forEach((_, c) => {
        send(this, c, buff);
      });
    };
    this.awareness.on("update", awarenessChangeHandler);
    this.on("update", updateHandler);
    let debounceWait = 1000;
    if (isNumber(CALLBACK_DEBOUNCE_WAIT)) {
      debounceWait = CALLBACK_DEBOUNCE_WAIT;
    }
    if (!isNumber(CALLBACK_DEBOUNCE_WAIT)) {
      debounceWait = parseInt(CALLBACK_DEBOUNCE_WAIT);
    }
    if (isCallbackSet) {
      this.on(
        "update",
        debounce(callbackHandler, debounceWait, {
          maxWait: debounceWait,
        })
      );
    }
  }
}

function isNumber(num: number | string): num is number {
  return !!num;
}

/**
 * Gets a Y.Doc by name, whether in memory or on disk
 *
 * @param {string} docname - the name of the Y.Doc to find or create
 * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
 * @return {WSSharedDoc}
 */
export function getYDoc(docname: string, gc = true) {
  return map.setIfUndefined(docs, docname, () => {
    const doc = new WSSharedDoc(docname);
    doc.gc = gc;
    if (persistence !== null) {
      persistence.bindState(docname, doc);
    }
    docs.set(docname, doc);
    return doc;
  });
}

/**
 * @param {any} conn
 * @param {WSSharedDoc} doc
 * @param {Uint8Array} message
 */
function messageListener(
  conn: Set<number>,
  doc: WSSharedDoc,
  message: Uint8Array
) {
  try {
    const encoder = encoding.createEncoder();
    const decoder = decoding.createDecoder(message);
    const messageType = decoding.readVarUint(decoder);
    switch (messageType) {
      case messageSync:
        encoding.writeVarUint(encoder, messageSync);
        syncProtocol.readSyncMessage(decoder, encoder, doc, conn);

        // If the `encoder` only contains the type of reply message and no
        // message, there is no need to send the message. When `encoder` only
        // contains the type of reply, its length is 1.
        if (encoding.length(encoder) > 1) {
          send(doc, conn, encoding.toUint8Array(encoder));
        }
        break;
      case messageAwareness: {
        awarenessProtocol.applyAwarenessUpdate(
          doc.awareness,
          decoding.readVarUint8Array(decoder),
          conn
        );
        break;
      }
    }
  } catch (err) {
    console.error(err);
    doc.emit("error", [err]);
  }
}

/**
 * @param {WSSharedDoc} doc
 * @param {any} conn
 */
function closeConn(doc: WSSharedDoc, conn: any) {
  if (doc.conns.has(conn)) {
    /**
     * @type {Set<number>}
     */
    // @ts-ignore
    const controlledIds = doc.conns.get(conn);
    doc.conns.delete(conn);
    awarenessProtocol.removeAwarenessStates(
      doc.awareness,
      Array.from(controlledIds),
      null
    );
    if (doc.conns.size === 0 && persistence !== null) {
      // if persisted, we store state and destroy ydocument
      persistence.writeState(doc.name, doc).then(() => {
        doc.destroy();
      });
      docs.delete(doc.name);
    }
  }
  conn.close();
}

/**
 * @param {WSSharedDoc} doc
 * @param {any} conn
 * @param {Uint8Array} m
 */
function send(doc: WSSharedDoc, conn: any, m: Uint8Array) {
  if (
    conn.readyState !== wsReadyStateConnecting &&
    conn.readyState !== wsReadyStateOpen
  ) {
    closeConn(doc, conn);
  }
  try {
    conn.send(
      m,
      /** @param {unknown} err */ (err: unknown) => {
        err != null && closeConn(doc, conn);
      }
    );
  } catch (e) {
    closeConn(doc, conn);
  }
}

const pingTimeout = 30000;
interface WSConnectionOpts {
  docName?: string | undefined;
  gc?: boolean | undefined;
}
/**
 * @param {any} conn
 * @param {any} req
 * @param {any} opts
 */
export function setupWSConnection(
  conn: any,
  req: IncomingMessage,
  { docName = req.url?.slice(1).split("?")[0], gc = true }: any = {}
) {
  console.log("CHECK REQ.URL", { reqUrl: req.url, docName });

  conn.binaryType = "arraybuffer";
  const newDocName = docName ? docName : "no-doc-name-" + Date.now().toString();
  // get doc, initialize if it does not exist yet
  const doc = getYDoc(newDocName, gc);
  doc.conns.set(conn, new Set());
  // listen and reply to events
  conn.on(
    "message",
    /** @param {ArrayBuffer} message */ (message: ArrayBuffer) =>
      messageListener(conn, doc, new Uint8Array(message))
  );

  // Check if connection is still alive
  let pongReceived = true;
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      if (doc.conns.has(conn)) {
        closeConn(doc, conn);
      }
      clearInterval(pingInterval);
    } else if (doc.conns.has(conn)) {
      pongReceived = false;
      try {
        conn.ping();
      } catch (e) {
        closeConn(doc, conn);
        clearInterval(pingInterval);
      }
    }
  }, pingTimeout);
  conn.on("close", () => {
    closeConn(doc, conn);
    clearInterval(pingInterval);
  });
  conn.on("pong", () => {
    pongReceived = true;
  });
  // put the following in a variables in a block so the interval handlers don't keep in in
  // scope
  {
    // send sync step 1
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc);
    send(doc, conn, encoding.toUint8Array(encoder));
    const awarenessStates = doc.awareness.getStates();
    if (awarenessStates.size > 0) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(
          doc.awareness,
          Array.from(awarenessStates.keys())
        )
      );
      send(doc, conn, encoding.toUint8Array(encoder));
    }
  }
}
