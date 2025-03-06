import express from "express";
import connectdb from "./src/config/db.config";
import bodyParser from "body-parser";
import authRouter from "./src/routes/user";
import orderRouter from "./src/routes/order";
import { linkDlqWithMainQ, setupSQSQueue } from "./src/config/aws-sqs.config";
import { receiveMessage } from "./src/consumer/aws.consumer";
import { connectRedis } from "./src/config/redis.config";
import { validateAuth } from "./src/middleware/validateAuth";
import { envConfig } from "./src/config/envConfig";
const PORT = envConfig.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connectdb();

app.use("/api/auth", authRouter);
app.use("/api", validateAuth, orderRouter);

const startServer = async () => {
  console.log("Setting up SQS queue...");
  await setupSQSQueue(); // creating main queue url
  await linkDlqWithMainQ(); // creating dlq queue for faile messages
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  await receiveMessage();
};

startServer();

// app.listen(PORT, () => {
//   console.log("server is running on", PORT);
// });
