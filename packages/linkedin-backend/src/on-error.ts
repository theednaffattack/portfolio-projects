import { config } from "./config";

/**
 * Event listener for HTTP server "error" event.
 */
export function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind =
    typeof config.env.PORT === "string"
      ? "Pipe " + config.env.PORT
      : "Port " + config.env.PORT;

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
