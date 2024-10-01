import { type ILogObj, Logger } from "tslog";

export const logger = new Logger<ILogObj>({
  name: "logger",
});

export const middlewareLogger = logger.getSubLogger({
  name: "middleware",
  hideLogPositionForProduction: true,
});
