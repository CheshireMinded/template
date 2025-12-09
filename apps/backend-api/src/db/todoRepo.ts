import { v4 as uuidv4 } from "uuid";
import { getDb } from "./connection";
import { Todo, CreateTodoInput, UpdateTodoInput } from "../models/todo";

export const todoRepo = {
  async all(userId: string): Promise<Todo[]> {
    const db = getDb();
    const rows = await db("todos")
      .where({ user_id: userId })
      .orderBy("created_at", "asc");
    return rows.map(mapRow);
  },

  async get(id: string, userId: string): Promise<Todo | undefined> {
    const db = getDb();
    const row = await db("todos")
      .where({ id, user_id: userId })
      .first();
    return row ? mapRow(row) : undefined;
  },

  async create(todo: Omit<Todo, "created_at" | "updated_at">): Promise<Todo> {
    const db = getDb();
    const now = new Date().toISOString();
    const todoWithTimestamps = {
      ...todo,
      created_at: now,
      updated_at: now
    };

    await db("todos").insert({
      id: todoWithTimestamps.id,
      user_id: todoWithTimestamps.user_id,
      title: todoWithTimestamps.title,
      description: todoWithTimestamps.description ?? null,
      completed: todoWithTimestamps.completed ? 1 : 0,
      created_at: todoWithTimestamps.created_at,
      updated_at: todoWithTimestamps.updated_at
    });

    const created = await this.get(todoWithTimestamps.id, todoWithTimestamps.user_id);
    if (!created) {
      throw new Error("Failed to create todo");
    }
    return created;
  },

  async update(id: string, userId: string, input: UpdateTodoInput): Promise<Todo | undefined> {
    const db = getDb();
    const existing = await this.get(id, userId);
    if (!existing) return undefined;

    const updated_at = new Date().toISOString();
    const updateData: any = {
      updated_at
    };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description ?? null;
    if (input.completed !== undefined) updateData.completed = input.completed ? 1 : 0;

    await db("todos")
      .where({ id, user_id: userId })
      .update(updateData);

    return this.get(id, userId);
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const db = getDb();
    const deleted = await db("todos")
      .where({ id, user_id: userId })
      .delete();
    return deleted > 0;
  }
};

function mapRow(row: any): Todo {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    description: row.description ?? undefined,
    completed: !!row.completed,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}
