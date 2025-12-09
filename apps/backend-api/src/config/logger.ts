import { getEnv } from "./env";

const env = getEnv();

type Level = "debug" | "info" | "warn" | "error";

const levelPriority: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function shouldLog(level: Level): boolean {
  return levelPriority[level] >= levelPriority[env.LOG_LEVEL];
}

function log(level: Level, message: string, meta?: Record<string, unknown>) {
  if (!shouldLog(level)) return;

  const payload = {
    level,
    message,
    meta,
    timestamp: new Date().toISOString(),
    service: env.APP_NAME
  };

  // structured JSON logging
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => log("debug", msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => log("info", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log("warn", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log("error", msg, meta)
};

