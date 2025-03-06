import {
  SQSClient,
  GetQueueUrlCommand,
  CreateQueueCommand,
  SetQueueAttributesCommand,
  CreateQueueCommandInput,
  GetQueueAttributesCommand,
  GetQueueAttributesCommandInput,
  GetQueueAttributesCommandOutput,
} from "@aws-sdk/client-sqs";
import { envConfig } from "./envConfig";

export const sqsClient = new SQSClient({
  region: "us-west-2",
  endpoint: envConfig.AWS_ENDPOINT,
});

export const SQS_QUEUE_NAME = envConfig.AWS_SQS_QUEUE_NAME!;
export let SQS_QUEUE_URL = "";

export const setupSQSQueue = async () => {
  try {
    const queueUrlResponse = await sqsClient.send(
      new GetQueueUrlCommand({ QueueName: SQS_QUEUE_NAME })
    );

    SQS_QUEUE_URL = queueUrlResponse.QueueUrl!;

    console.log(`Using existing SQS queue: ${SQS_QUEUE_URL}`);
  } catch (error: any) {
    if (error.name === "QueueDoesNotExist") {
      const queueUrl = await createQueueUrl({
        QueueName: SQS_QUEUE_NAME,
      });
      SQS_QUEUE_URL = queueUrl;
      console.log(`Created new SQS queue: ${SQS_QUEUE_URL}`);
    } else {
      console.error("Error setting up SQS queue:", error);
    }
  }
};

const createQueueUrl = async (queueParams: CreateQueueCommandInput) => {
  console.log("creating a queue...");
  const queueResponse = await sqsClient.send(
    new CreateQueueCommand(queueParams)
  );
  return queueResponse.QueueUrl!;
};

export const linkDlqWithMainQ = async () => {
  try {
    const dlqParams = {
      QueueName: envConfig.AWS_DLQ_QUEUE_NAME,
      Attributes: {
        MessageRetentionPeriod: "1209600", // 14 days (in seconds)
        DelaySeconds: "0",
      },
    };

    const dlqUrl = await createQueueUrl(dlqParams);
    console.log(`DLQ created: ${dlqUrl}`);

    // Get DLQ ARN
    const dlqArnParams: GetQueueAttributesCommandInput = {
      QueueUrl: dlqUrl,
      AttributeNames: ["QueueArn"],
    };
    const dlqArnCommand = new GetQueueAttributesCommand(dlqArnParams);
    const dlqArnResponse: GetQueueAttributesCommandOutput =
      await sqsClient.send(dlqArnCommand);
    const dlqArn = dlqArnResponse?.Attributes?.QueueArn;

    console.log(dlqArn, "arn");

    const mainQueueParams = {
      QueueUrl: SQS_QUEUE_URL,
      Attributes: {
        RedrivePolicy: JSON.stringify({
          deadLetterTargetArn: dlqArn,
          maxReceiveCount: 3,
        }),
        DelaySeconds: "0",
      },
    };

    const mainQueueCommand = new SetQueueAttributesCommand(mainQueueParams);
    await sqsClient.send(mainQueueCommand);
    console.log(`DLQ linked to the main queue`);
  } catch (error) {
    console.error("Error creating queues:", error);
  }
};
