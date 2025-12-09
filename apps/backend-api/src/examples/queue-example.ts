/**
 * Example: Using SQS message queue for async processing
 * 
 * This demonstrates how to offload heavy operations to a message queue.
 * Uncomment and adapt this code to use queues in your controllers.
 */

import { Request, Response } from "express";
import { queueEmailNotification, sendMessage } from "../queue/sqs";
import { AuthPayload } from "../middleware/auth";

interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

/**
 * Example: Send welcome email asynchronously after user registration
 * 
 * Instead of sending email synchronously (which blocks the request),
 * we queue it for async processing by a worker.
 */
export async function registerUserWithEmailQueue(
  req: AuthenticatedRequest,
  res: Response
) {
  // ... user registration logic ...

  // Queue email notification instead of sending synchronously
  try {
    await queueEmailNotification(
      "user-id",
      "user@example.com",
      "Welcome to our platform!"
    );
  } catch (error) {
    // Log error but don't fail registration
    console.error("Failed to queue email notification:", error);
  }

  // Return success immediately
  res.status(201).json({ ok: true, message: "User registered" });
}

/**
 * Example: Queue a background job for data processing
 */
export async function processDataAsync(
  req: AuthenticatedRequest,
  res: Response
) {
  const userId = req.user?.sub;
  const { dataId } = req.body;

  // Queue processing job
  await sendMessage({
    type: "process_data",
    payload: {
      userId,
      dataId,
      priority: "normal"
    }
  });

  // Return immediately - processing happens in background
  res.json({
    ok: true,
    message: "Data processing queued",
    jobId: dataId
  });
}

/**
 * Example worker function (runs in separate process)
 * 
 * This would typically run in a worker service or Lambda function.
 */
export async function runWorker() {
  // Import processQueuedMessages from queue/sqs
  const { processQueuedMessages } = await import("../queue/sqs");

  // Poll for messages continuously
  setInterval(async () => {
    try {
      await processQueuedMessages();
    } catch (error) {
      console.error("Worker error:", error);
    }
  }, 5000); // Poll every 5 seconds
}

