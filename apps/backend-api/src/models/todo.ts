/**
 * Todo model
 * 
 * Simple in-memory storage for demonstration.
 * In production, this would use a database (PostgreSQL, MongoDB, etc.)
 */

import { v4 as uuidv4 } from "uuid";

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

