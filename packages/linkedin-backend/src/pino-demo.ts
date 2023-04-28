import { logger } from "./logger";

logger.fatal("Fatal message");
logger.error("Error message");
logger.warn("Warn message");
logger.info("Info message");
logger.debug("Debug message");
logger.trace("Trace message");

// Output:
// {"level":60,"time":1663751177889,"pid":39927,"hostname":"node","msg":"Fatal message"}
// {"level":50,"time":1663751177890,"pid":39927,"hostname":"node","msg":"Error message"}
// {"level":40,"time":1663751177890,"pid":39927,"hostname":"node","msg":"Warn message"}
// {"level":30,"time":1663751177890,"pid":39927,"hostname":"node","msg":"Info message"}
