import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "node:http";
import * as Colors from "colors.ts";
import cors from "cors";
import getLogger from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import { createYjsServer, defaultDocNameFromRequest } from "yjs-server";
import * as Y from "yjs";

import { isAddressInfo } from "./is-address-info";
import { isString } from "utils/src/is-string";
import { config } from "./config";

const { colors } = Colors;

// const host = internalIpV4Sync();
const app = express();
const server = http.createServer(app);

// app.use((req, res) => res.sendFile("/websocket-client.html", { root: __dirname }));
app.use(getLogger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors);

server.on("error", onError);
server.listen(config.env.PORT, config.ip.host, handleWebServerListen);

const socketServer = new WebSocketServer({ path: config.socket.path, port: config.env.WS_PORT });
const yjss = createYjsServer({
  createDoc: () => new Y.Doc(),
});

socketServer.on("connection", handleSocketConnection);
socketServer.on("sync", function (...args) {
  console.log("sync");
  console.log(args);
});
socketServer.on("update", function (...args) {
  console.log("update");
  console.log(args);
});

// Event Handlers
/**
 * Event listener for WSS server "connection" event.
 */
function handleSocketConnection(socket: WebSocket, request) {
  // DON'T DELETE YET - NEEDED TO IMPLEMENT AUTHORIZATION
  //   const whenAuthorized = authorize(socket, request).catch(() => {
  //     // manually close the socket using a custom error code
  //     socket.close(4001);

  //     // signal that the YjsServer should drop the connection
  //     return false;
  //   });

  console.log("New client connected!");
  socket.send("connection established");
  socket.on("close", () => console.log("Client has disconnected!"));
  //   socket.on("message", (data) => {
  //     socketServer.clients.forEach((client) => {
  //       console.log(`distributing message: ${data}`);

  //       //   client.send(`${data}`);
  //       client.send(data);
  //     });
  //   });

  yjss.handleConnection(socket, request);
  //   yjss.handleConnection(socket, request, whenAuthorized);
  socket.onerror = function (evt) {
    console.log("websocket error", evt);
  };
}

/**
 * Event listener for HTTP server "listening" event.
 */
function handleWebServerListen() {
  let wsMessage;
  let message;
  let addr = server.address();
  const wsPrefix = "ws://";
  const httpPrefix = "http://";

  // Use type guard to determine if the addr variable
  // is an ojbect or a string.
  if (isAddressInfo(addr)) {
    wsMessage =
      "WebSocket server running at: " +
      colors("red", `${wsPrefix}${addr.address}:${config.env.WS_PORT}${config.socket.path}`);
    message =
      "HTTP server running at:      " +
      colors("red", `${httpPrefix}${addr.address}:${config.env.PORT}`);
  }
  if (isString(addr)) {
    wsMessage = colors("red", `${wsPrefix}${addr}:${config.env.WS_PORT}`);
    message = colors("red", `${httpPrefix}${addr}:${config.env.PORT}`);
  }

  console.log(wsMessage);
  console.log(message);
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind =
    typeof config.env.PORT === "string" ? "Pipe " + config.env.PORT : "Port " + config.env.PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

async function authorize(_socket: WebSocket, request: http.IncomingMessage) {
  // option 1) use a param in the request.url
  const docName = defaultDocNameFromRequest(request);

  if (!docName) throw new Error("invalid doc name");

  const auth = new URL(request.url!, "http://" + config.ip.host).searchParams.get("authQueryParam");

  // validate auth has access to docName...

  // option2) use request.headers.cookie (only works if the server is on the same origin)

  // signal that the connection should be considered authorized
  return true;
}
