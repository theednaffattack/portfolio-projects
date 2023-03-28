import { WebSocketServer, WebSocket } from "ws";
import { createYjsServer, defaultDocNameFromRequest } from "yjs-server";
import * as http from "http";
import * as Y from "yjs";

const wss = new WebSocketServer({ port: 8080 });
const yjss = createYjsServer({
  createDoc: () => new Y.Doc(),
});

wss.on("connection", (socket, request) => {
  const whenAuthorized = authorize(socket, request).catch(() => {
    // manually close the socket using a custom error code
    socket.close(4001);

    // signal that the YjsServer should drop the connection
    return false;
  });

  // handleConnection must be called immediately after the connection is established
  // otherwise, messages might be lost
  yjss.handleConnection(socket, request, whenAuthorized);
});

async function authorize(_socket: WebSocket, request: http.IncomingMessage) {
  // option 1) use a param in the request.url
  const docName = defaultDocNameFromRequest(request);

  if (!docName) throw new Error("invalid doc name");

  // @ts-ignore
  const auth = new URL(request.url!, "http://localhost").searchParams.get("authQueryParam");

  // validate auth has access to docName...

  // option2) use request.headers.cookie (only works if the server is on the same origin)

  // signal that the connection should be considered authorized
  return true;
}
