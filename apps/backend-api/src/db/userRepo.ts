import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "./connection";
import { User, CreateUserInput } from "../models/user";

export const userRepo = {
  async findByUsername(username: string): Promise<User | undefined> {
    const db = getDb();
    const row = await db("users").where({ username }).first();
    return row ? mapRow(row) : undefined;
  },

  async findById(id: string): Promise<User | undefined> {
    const db = getDb();
    const row = await db("users").where({ id }).first();
    return row ? mapRow(row) : undefined;
  },

  async create(input: CreateUserInput): Promise<User> {
    const db = getDb();
    const id = uuidv4();
    const password_hash = await bcrypt.hash(input.password, 10);
    const now = new Date().toISOString();

    await db("users").insert({
      id,
      username: input.username,
      password_hash,
      created_at: now,
      updated_at: now
    });

    const user = await this.findById(id);
    if (!user) {
      throw new Error("Failed to create user");
    }
    return user;
  },

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }
};

function mapRow(row: any): User {
  return {
    id: row.id,
    username: row.username,
    password_hash: row.password_hash,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

