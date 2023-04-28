import { InternalServerError } from "./internal-server-error";

export class DatabaseError extends InternalServerError {
  public constructor(cause?: string) {
    super({
      extensions: {
        kind: "DB",
        cause: cause ? cause.replace("P", "DB") : null,
      },
    });

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
