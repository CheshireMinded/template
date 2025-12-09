import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("todos", (table) => {
    table.string("id").primary();
    table.string("user_id").notNullable();
    table.string("title").notNullable();
    table.text("description");
    table.boolean("completed").notNullable().defaultTo(false);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    // Foreign key constraint (SQLite doesn't enforce this, but Postgres will)
    if (knex.client.config.client !== "better-sqlite3" && knex.client.config.client !== "sqlite3") {
      table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("todos");
}

