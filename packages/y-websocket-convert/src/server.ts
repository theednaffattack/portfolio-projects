import WebSocket from "ws";
import http from "node:http";
import { setupWSConnection } from "./utils";

const wss = new WebSocket.Server({ noServer: true });
const host = process.env.HOST || "localhost";
const port = 1234;

const server = http.createServer((_request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay");
});

wss.on("connection", setupWSConnection);

server.on("upgrade", (request, socket, head) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  function handleAuth(ws: WebSocket) {
    wss.emit("connection", ws, request);
  }
  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`);
});
