import knex, { Knex } from "knex";
import { getEnv } from "../config/env";

let dbInstance: Knex | null = null;

export function getDb(): Knex {
  if (dbInstance) {
    return dbInstance;
  }

  const env = getEnv();

  const config: Knex.Config = {
    client: env.DB_TYPE === "postgres" ? "pg" : "better-sqlite3",
    connection:
      env.DB_TYPE === "postgres"
        ? env.DATABASE_URL!
        : {
            filename: env.DB_PATH
          },
    useNullAsDefault: env.DB_TYPE === "sqlite"
  };

  dbInstance = knex(config);
  return dbInstance;
}

export async function closeDb(): Promise<void> {
  if (dbInstance) {
    await dbInstance.destroy();
    dbInstance = null;
  }
}

