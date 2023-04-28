import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import getLogger from "morgan";
import http from "node:http";
import { createTerminus } from "@godaddy/terminus";

import { config } from "./config";
import { onError } from "./on-error";
import { handleWebServerListen } from "./handle-web-server-listen";
import { onHealthCheck } from "./on-health-check";
import { onSignal } from "./on-signal";

const router = express.Router();

const app = express();
const server = http.createServer(app);

// Home page route.
router.get("/", function (req, res) {
  console.log("Yoooooo");

  res.send("Wiki home page");
});

// About page route
router.get("/about", function (req, res) {
  res.send("About this wiki");
});

app.use(getLogger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors);

app.use("/sign-in", router);

createTerminus(server, {
  signal: "SIGINT",
  healthChecks: { "/healthcheck": onHealthCheck },
  onSignal,
});

server.on("error", onError);
server.listen(config.env.PORT, config.ip.host, handleWebServerListen);
