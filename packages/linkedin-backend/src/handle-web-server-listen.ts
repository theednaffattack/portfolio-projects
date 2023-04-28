import * as Colors from "colors.ts";
const { colors } = Colors;

import { config } from "./config";

/**
 * Event listener for HTTP server "listening" event.
 */
export function handleWebServerListen(url?: string) {
  let wsMessage;
  let coloredUrl;
  let serverMessage = "Server is running, GraphQL Playground available at ";
  let signInMessage;
  // let addr = server.address();
  const wsPrefix = "ws://";
  const httpPrefix = "http://";

  wsMessage = colors(
    "red",
    `${wsPrefix}${config.ip.host}:${config.env.WS_PORT}`
  );
  coloredUrl = colors("red", `${url}`);

  signInMessage = colors(
    "red",
    `${httpPrefix}${config.ip.host}:${config.env.PORT}/sign-in`
  );

  console.log(wsMessage);
  console.log(serverMessage, coloredUrl);
  console.log(signInMessage);
}
