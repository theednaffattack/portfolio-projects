import { InternalServerError } from "./internal-server-error";

export class TokenError extends InternalServerError {
  public constructor(cause?: string) {
    super({
      extensions: {
        kind: "TOKEN",
        cause: cause || null,
      },
    });

    Object.setPrototypeOf(this, TokenError.prototype);
  }
}
