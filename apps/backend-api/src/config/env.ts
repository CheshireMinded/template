type Env = {
  PORT: number;
  NODE_ENV: "development" | "test" | "production";
  CORS_ORIGIN: string;
  APP_NAME: string;
  APP_VERSION: string;
  LOG_LEVEL: "debug" | "info" | "warn" | "error";
};

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const {
    PORT,
    NODE_ENV,
    CORS_ORIGIN,
    APP_NAME,
    APP_VERSION,
    LOG_LEVEL
  } = process.env;

  const parsed: Env = {
    PORT: Number(PORT ?? 3000),
    NODE_ENV: (NODE_ENV as Env["NODE_ENV"]) ?? "development",
    CORS_ORIGIN: CORS_ORIGIN ?? "http://localhost:5173",
    APP_NAME: APP_NAME ?? "backend-api",
    APP_VERSION: APP_VERSION ?? "dev",
    LOG_LEVEL: (LOG_LEVEL as Env["LOG_LEVEL"]) ?? "info"
  };

  // Very simple validation (you could make this stricter)
  if (!parsed.PORT || Number.isNaN(parsed.PORT)) {
    throw new Error("Invalid or missing PORT");
  }

  cachedEnv = parsed;
  return parsed;
}

