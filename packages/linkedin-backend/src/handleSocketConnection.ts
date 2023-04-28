import { WebSocket } from "ws";

// const socketServer = new WebSocketServer({
//   path: config.socket.path,
//   port: config.env.WS_PORT,
// });
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
