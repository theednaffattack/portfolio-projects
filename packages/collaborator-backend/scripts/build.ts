import { build } from "esbuild";
import { dependencies } from "../package.json";

const sharedConfig = {
  entryPoints: ["src/server.ts"],
  bundle: true,
  minify: true,
  external: Object.keys(dependencies).concat("node:*"), // Object.keys(dependencies).concat(Object.keys(peerDependencies)),
};

// build({
//   ...sharedConfig,
//   platform: "node", // for CJS
//   outfile: "dist/index.js",
// });

build({
  ...sharedConfig,
  outfile: "dist/index.esm.mjs",
  platform: "neutral", // for ESM
  format: "esm",
});
