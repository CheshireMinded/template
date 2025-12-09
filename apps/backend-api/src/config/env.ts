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

  const nodeEnv = (NODE_ENV as Env["NODE_ENV"]) ?? "development";
  const isProduction = nodeEnv === "production";

  // In production, fail fast if required vars are missing
  if (isProduction) {
    const required = ["PORT", "CORS_ORIGIN"];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables in production: ${missing.join(", ")}`);
    }
  }

  const parsed: Env = {
    PORT: Number(PORT ?? 3000),
    NODE_ENV: nodeEnv,
    CORS_ORIGIN: CORS_ORIGIN ?? (isProduction ? "" : "http://localhost:5173"),
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

