import { logger } from "firebase-functions/v2";
import express from "express";
import morgan from "morgan";

const app = express();

// setup logger
app.use(
  morgan("combined", {
    stream: {
      write: logger.log,
    },
  })
);

export default app;
