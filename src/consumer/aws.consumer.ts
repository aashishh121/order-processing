import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { SQS_QUEUE_URL, sqsClient } from "../config/aws-sqs.config";
import { Order } from "../models/order.schema";
import { redisClient } from "../config/redis.config";
import { emailSend } from "../utils/helpurFunction";

export const receiveMessage = async () => {
  while (true) {
    try {
      const params = {
        QueueUrl: SQS_QUEUE_URL,
        WaitTimeSeconds: 10,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 30,
      };

      console.log("Waiting for new messages...");
      const receiveMessageCommand = new ReceiveMessageCommand(params);
      const message = await sqsClient.send(receiveMessageCommand);

      if (message.Messages && message.Messages.length > 0) {
        console.log("New message Received");

        const order = message.Messages[0].Body;
        const orderObj = JSON.parse(order!);
        const newOrder = { ...orderObj, status: "Processed" };
        try {
          await saveInDb(newOrder);
          await emailSend(newOrder);

          // Extract ReceiptHandle for message deletion
          const receiptHandle = message.Messages[0].ReceiptHandle;
          await deleteMessage(receiptHandle);
        } catch (error) {
          console.log("Order processing error ", error);
        }
      } else {
        console.log("No messages, waiting for the next poll...");
      }
    } catch (error) {
      console.error("Error receiving message:", error);
    }
  }
};

const deleteMessage = async (receiptHandle: any) => {
  try {
    const deleteParams = {
      QueueUrl: SQS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    };

    const deleteMessageCommand = new DeleteMessageCommand(deleteParams);
    await sqsClient.send(deleteMessageCommand);
    console.log("Message deleted successfully.");
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};

const saveInDb = async (newOrder: any) => {
  try {
    await new Order(newOrder).save();
    await redisClient.setEx(
      `${newOrder.orderId}`,
      600,
      JSON.stringify(newOrder)
    );
  } catch (error) {
    throw new Error("Error saving order: " + error);
  }
};
