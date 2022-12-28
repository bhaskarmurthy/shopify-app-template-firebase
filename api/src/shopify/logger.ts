import { logger } from "firebase-functions/v2";
import { LogFunction, LogSeverity } from "@shopify/shopify-api";

const log: LogFunction = async (severity: LogSeverity, msg: string) => {
  switch (severity) {
    case LogSeverity.Debug:
      logger.debug(msg);
      break;
    case LogSeverity.Error:
      logger.error(msg);
      break;
    case LogSeverity.Info:
      logger.info(msg);
      break;
    case LogSeverity.Warning:
      logger.warn(msg);
      break;
    default:
      logger.log(msg);
  }
};

export default log;
