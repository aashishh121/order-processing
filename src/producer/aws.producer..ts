import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { SQS_QUEUE_URL, sqsClient } from "../config/aws-sqs.config";
import { InewOrder } from "../types/common.types";

export const sendMessage = async (newOrder: InewOrder) => {
  try {
    const messageBody = JSON.stringify(newOrder);

    const params = {
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: messageBody,
    };

    await sqsClient.send(new SendMessageCommand(params));
    console.log("order sent to the queue");
  } catch (error) {
    console.log(error);
  }
};
