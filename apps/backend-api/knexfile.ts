import type { Knex } from "knex";

// Knex config - using function to avoid calling getEnv() at module load time
// This allows the config to be loaded lazily when migrations run
const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_TYPE === "postgres" ? "pg" : "better-sqlite3",
    connection:
      process.env.DB_TYPE === "postgres"
        ? process.env.DATABASE_URL!
        : {
            filename: process.env.DB_PATH || "data/dev.db"
          },
    migrations: {
      directory: "./migrations",
      extension: "ts"
    },
    useNullAsDefault: process.env.DB_TYPE !== "postgres"
  },

  test: {
    client: "better-sqlite3",
    connection: ":memory:",
    migrations: {
      directory: "./migrations",
      extension: "ts"
    },
    useNullAsDefault: true
  },

  production: {
    client: "postgres",
    connection: process.env.DATABASE_URL!,
    migrations: {
      directory: "./migrations",
      extension: "ts"
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};

export default config;

