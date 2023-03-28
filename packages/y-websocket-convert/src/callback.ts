import http from "node:http";

import { WSSharedDoc } from "./utils";

const CALLBACK_URL = process.env.CALLBACK_URL
  ? new URL(process.env.CALLBACK_URL)
  : null;
const GET_TIMEOUT = process.env.CALLBACK_TIMEOUT || 5000;
let CALLBACK_TIMEOUT: number;
if (isNumber(GET_TIMEOUT)) {
  CALLBACK_TIMEOUT = GET_TIMEOUT;
} else {
  CALLBACK_TIMEOUT = parseInt(GET_TIMEOUT);
}

const CALLBACK_OBJECTS = process.env.CALLBACK_OBJECTS
  ? JSON.parse(process.env.CALLBACK_OBJECTS)
  : {};

export const isCallbackSet = !!CALLBACK_URL;

interface DataToSend {
  room: string;
  data: { [key: string]: unknown };
}

/**
 * @param {Uint8Array} update
 * @param {any} origin
 * @param {WSSharedDoc} doc
 */
export function callbackHandler(_update: any, _origin: any, doc: WSSharedDoc) {
  const room = doc.name;
  const dataToSend: DataToSend = {
    room,
    data: {},
  };

  const sharedObjectList = Object.keys(CALLBACK_OBJECTS);
  sharedObjectList.forEach((sharedObjectName) => {
    const sharedObjectType = CALLBACK_OBJECTS[sharedObjectName];
    dataToSend.data[sharedObjectName] = {
      type: sharedObjectType,
      content: JSON.stringify(
        getContent(sharedObjectName, sharedObjectType, doc)
      ), // .toJSON(),
    };
  });

  if (isURL(CALLBACK_URL)) {
    callbackRequest(CALLBACK_URL, CALLBACK_TIMEOUT, dataToSend);
  }
}

/**
 * @param {URL} url
 * @param {number} timeout
 * @param {Object} data
 */
function callbackRequest(url: URL, timeout: number, data: any) {
  data = JSON.stringify(data);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    timeout,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };
  const req = http.request(options);
  req.on("timeout", () => {
    console.warn("Callback request timed out.");
    req.destroy();
  });
  req.on("error", (e) => {
    console.error("Callback request error.", e);
    req.destroy();
  });
  req.write(data);
  req.end();
}

/**
 * @param {string} objName
 * @param {string} objType
 * @param {WSSharedDoc} doc
 */
function getContent(
  objName: string,
  objType: "Array" | "Map" | "Set" | "Text" | "XmlFragment" | "XmlElement",
  doc: WSSharedDoc
) {
  switch (objType) {
    case "Array":
      return doc.getArray(objName);
    case "Map":
      return doc.getMap(objName);
    case "Text":
      return doc.getText(objName);
    case "XmlFragment":
      return doc.getXmlFragment(objName);
    case "XmlElement":
      throw new Error(
        "That method may be deprecated. Still checking with Y.Doc"
      );
    // return doc.getXmlElement(objName);
    default:
      return {};
  }
}

// BEGIN Type Guards
function isURL(str: URL | null): str is URL {
  return !!str;
}

function isNumber(num: number | string): num is number {
  return !!num;
}

// END Type Guards
