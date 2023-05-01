import jwt from "jsonwebtoken";
import { config } from "../config";
import { TokenError } from "../errors/token-error";
import type { Token, TokenPayload } from "../types/all";

export class TokenService {
  public static readonly SIGN_OPTIONS: jwt.SignOptions = {
    algorithm: config.token.algorithm,
    expiresIn: config.token.expiration,
  };

  public static readonly VERIFY_OPTIONS: jwt.VerifyOptions = {
    algorithms: [config.token.algorithm],
    complete: true,
  };

  public sign(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        { key: config.token.privateKey, passphrase: config.token.passphrase },
        TokenService.SIGN_OPTIONS,
        (error, encoded) => {
          if (error) reject(new TokenError(error.message));
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          else resolve(encoded!);
        }
      );
    });
  }

  public verify(token: string): Promise<Token> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        config.token.publicKey,
        TokenService.VERIFY_OPTIONS,
        (error, decoded) => {
          if (error) reject(new TokenError(error.message));
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          else resolve(decoded! as Token);
        }
      );
    });
  }
}
