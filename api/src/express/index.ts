import { logger } from "firebase-functions/v2";
import express from "express";
import morgan from "morgan";

const app = express();

// setup logger
app.use(
  morgan("tiny", {
    stream: {
      write: logger.log,
    },
  })
);

export default app;
