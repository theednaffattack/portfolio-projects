import type jwt from "jsonwebtoken";
import type pino from "pino";

export type Config = {
  app: string;
  node: {
    env: string;
  };
  server: {
    host: string;
    port: number;
  };
  logger: {
    level: pino.LevelWithSilent;
  };
  database: {
    url: string;
  };
  token: {
    expiration: number;
    algorithm: jwt.Algorithm;
    passphrase: string;
    privateKey: string;
    publicKey: string;
  };
  // ssh: {
  //   username: string;
  //   passphrase: string;
  //   privateKey: string;
  // };
  graphql: {
    path: string;
  };
  // k8s: {
  //   label: {
  //     node: {
  //       id: string;
  //     };
  //   };
  // };
  user: {
    username: {
      validation: {
        maxLength: number;
      };
    };
    password: {
      validation: {
        minLength: number;
        maxLength: number;
        minLowercase?: number;
        minUppercase?: number;
        minNumbers?: number;
        minSymbols?: number;
      };
    };
  };
  // nodePool: {
  //   controller: {
  //     name: string;
  //   };
  //   worker: {
  //     minNodes: number;
  //   };
  // };
};
