import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import express from "express";
import morgan from "morgan";

const app = express();
app.use(
  morgan("combined", {
    stream: {
      write: logger.log,
    },
  })
);

app.get("*", (req, res) => {
  const date = new Date();
  res.status(200).send(`[${date.toISOString()}] hello world`);
});

export default onRequest(app);
