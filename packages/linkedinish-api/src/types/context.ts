import type { TokenPayload } from "./token";

export type ContextType = {
  ip: string;
  applicant?: TokenPayload | undefined;
};
