import knex from "knex";
import { getEnv } from "../config/env";
import config from "../../knexfile";

/**
 * Run database migrations
 * Called on application startup
 */
export async function runMigrations(): Promise<void> {
  const env = getEnv();
  const environment = env.NODE_ENV === "test" ? "test" : env.NODE_ENV === "production" ? "production" : "development";
  
  const db = knex(config[environment]);
  
  try {
    await db.migrate.latest();
    console.log("Database migrations completed");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await db.destroy();
  }
}

