import type { TerminusState } from "@godaddy/terminus";

export async function onHealthCheck({ state }: { state: TerminusState }) {
  // checks if the system is healthy, like the db connection is live
  // resolves, if health, rejects if not
  console.log("healthcheck", state);
}
