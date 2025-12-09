type Env = {
  PORT: number;
  NODE_ENV: "development" | "test" | "production";
  CORS_ORIGIN: string;
  APP_NAME: string;
  APP_VERSION: string;
  LOG_LEVEL: "debug" | "info" | "warn" | "error";
  AUTH_USERNAME?: string;
  AUTH_PASSWORD?: string;
  AUTH_JWT_SECRET?: string;
  DB_PATH: string;
  DATABASE_URL?: string;
  DB_TYPE: "sqlite" | "postgres";
  RATE_LIMIT_ENABLED: boolean;
  RATE_LIMIT_MAX_REQUESTS: number;
  RATE_LIMIT_WINDOW_MS: number;
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
    LOG_LEVEL,
    AUTH_USERNAME,
    AUTH_PASSWORD,
    AUTH_JWT_SECRET,
    DB_PATH,
    DATABASE_URL,
    DB_TYPE,
    RATE_LIMIT_ENABLED,
    RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_MS
  } = process.env;

  const nodeEnv = (NODE_ENV as Env["NODE_ENV"]) ?? "development";
  const isProduction = nodeEnv === "production";
  const isStaging = nodeEnv === "staging" || process.env.ENVIRONMENT === "staging";

  // Environment-specific defaults for CORS
  let defaultCorsOrigin: string;
  if (isProduction) {
    defaultCorsOrigin = ""; // Must be explicitly set in prod
  } else if (isStaging) {
    defaultCorsOrigin = process.env.STAGING_BASE_URL || "https://staging.app.example.com";
  } else {
    defaultCorsOrigin = "http://localhost:5173"; // dev
  }

  // Environment-specific defaults for rate limiting
  const defaultRateLimitEnabled = isProduction || isStaging;
  const defaultRateLimitMaxRequests = isProduction ? 60 : isStaging ? 100 : 200; // per window
  const defaultRateLimitWindowMs = 60 * 1000; // 1 minute

  // In production, fail fast if required vars are missing
  if (isProduction) {
    const required = ["PORT", "CORS_ORIGIN", "AUTH_JWT_SECRET", "DATABASE_URL"];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables in production: ${missing.join(", ")}`);
    }
  }

  // Determine database type
  const dbType = (DB_TYPE as Env["DB_TYPE"]) || (DATABASE_URL ? "postgres" : "sqlite");

  const parsed: Env = {
    PORT: Number(PORT ?? 3000),
    NODE_ENV: nodeEnv,
    CORS_ORIGIN: CORS_ORIGIN ?? defaultCorsOrigin,
    APP_NAME: APP_NAME ?? "backend-api",
    APP_VERSION: APP_VERSION ?? "dev",
    LOG_LEVEL: (LOG_LEVEL as Env["LOG_LEVEL"]) ?? "info",
    AUTH_USERNAME: AUTH_USERNAME ?? (isProduction ? undefined : "admin"),
    AUTH_PASSWORD: AUTH_PASSWORD ?? (isProduction ? undefined : "admin"),
    AUTH_JWT_SECRET: AUTH_JWT_SECRET ?? (isProduction ? undefined : "dev-secret"),
    DB_PATH: DB_PATH ?? (nodeEnv === "test" ? ":memory:" : "data/dev.db"),
    DATABASE_URL,
    DB_TYPE: dbType,
    RATE_LIMIT_ENABLED: RATE_LIMIT_ENABLED === "true" || (RATE_LIMIT_ENABLED === undefined ? defaultRateLimitEnabled : false),
    RATE_LIMIT_MAX_REQUESTS: Number(RATE_LIMIT_MAX_REQUESTS ?? defaultRateLimitMaxRequests),
    RATE_LIMIT_WINDOW_MS: Number(RATE_LIMIT_WINDOW_MS ?? defaultRateLimitWindowMs)
  };

  // Very simple validation (you could make this stricter)
  if (!parsed.PORT || Number.isNaN(parsed.PORT)) {
    throw new Error("Invalid or missing PORT");
  }

  // Validate CORS origin in production
  if (isProduction && !parsed.CORS_ORIGIN) {
    throw new Error("CORS_ORIGIN must be set in production");
  }

  // Validate database configuration
  if (parsed.DB_TYPE === "postgres" && !parsed.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set when using Postgres");
  }

  cachedEnv = parsed;
  return parsed;
}

