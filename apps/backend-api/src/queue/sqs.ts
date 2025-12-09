import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { getEnv } from "../config/env";

/**
 * AWS SQS Message Queue Example
 * 
 * This is an example implementation for async task processing.
 * In production, use proper error handling, retries, and DLQ (Dead Letter Queue).
 * 
 * Prerequisites:
 * - AWS credentials configured (via IAM role or credentials file)
 * - SQS queue created in AWS
 * - Queue URL set in SQS_QUEUE_URL environment variable
 */

let sqsClient: SQSClient | null = null;

export function getSQSClient(): SQSClient {
  if (sqsClient) {
    return sqsClient;
  }

  const env = getEnv();
  const region = process.env.AWS_REGION || "us-west-2";

  sqsClient = new SQSClient({ region });
  return sqsClient;
}

export interface QueueMessage {
  type: string;
  payload: Record<string, unknown>;
  timestamp?: string;
}

/**
 * Send a message to SQS queue
 */
export async function sendMessage(message: QueueMessage): Promise<string | undefined> {
  const queueUrl = process.env.SQS_QUEUE_URL;
  if (!queueUrl) {
    throw new Error("SQS_QUEUE_URL environment variable not set");
  }

  const client = getSQSClient();
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({
      ...message,
      timestamp: new Date().toISOString()
    })
  });

  try {
    const response = await client.send(command);
    return response.MessageId;
  } catch (error) {
    console.error("Failed to send message to SQS:", error);
    throw error;
  }
}

/**
 * Receive messages from SQS queue
 * 
 * In production, use long polling and process messages in a worker process.
 */
export async function receiveMessages(maxMessages: number = 10): Promise<Array<{
  receiptHandle: string;
  message: QueueMessage;
}>> {
  const queueUrl = process.env.SQS_QUEUE_URL;
  if (!queueUrl) {
    throw new Error("SQS_QUEUE_URL environment variable not set");
  }

  const client = getSQSClient();
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: maxMessages,
    WaitTimeSeconds: 20 // Long polling
  });

  try {
    const response = await client.send(command);
    if (!response.Messages) {
      return [];
    }

    return response.Messages.map((msg) => ({
      receiptHandle: msg.ReceiptHandle!,
      message: JSON.parse(msg.Body || "{}") as QueueMessage
    }));
  } catch (error) {
    console.error("Failed to receive messages from SQS:", error);
    throw error;
  }
}

/**
 * Delete a message from SQS queue (after processing)
 */
export async function deleteMessage(receiptHandle: string): Promise<void> {
  const queueUrl = process.env.SQS_QUEUE_URL;
  if (!queueUrl) {
    throw new Error("SQS_QUEUE_URL environment variable not set");
  }

  const client = getSQSClient();
  const command = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle
  });

  try {
    await client.send(command);
  } catch (error) {
    console.error("Failed to delete message from SQS:", error);
    throw error;
  }
}

/**
 * Example: Send email notification asynchronously
 */
export async function queueEmailNotification(userId: string, email: string, subject: string): Promise<void> {
  await sendMessage({
    type: "email_notification",
    payload: {
      userId,
      email,
      subject
    }
  });
}

/**
 * Example: Process queued messages (worker function)
 * 
 * This would typically run in a separate worker process or Lambda function.
 */
export async function processQueuedMessages(): Promise<void> {
  const messages = await receiveMessages(10);

  for (const { receiptHandle, message } of messages) {
    try {
      // Process message based on type
      switch (message.type) {
        case "email_notification":
          // Process email notification
          console.log("Processing email notification:", message.payload);
          // await sendEmail(message.payload);
          break;
        default:
          console.warn("Unknown message type:", message.type);
      }

      // Delete message after successful processing
      await deleteMessage(receiptHandle);
    } catch (error) {
      console.error("Failed to process message:", error);
      // In production, send to DLQ after max retries
    }
  }
}

