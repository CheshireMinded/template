import { v4 as uuidv4 } from "uuid";
import { todoRepo } from "../db/todoRepo";
import { Todo, CreateTodoInput, UpdateTodoInput } from "../models/todo";

export class TodoService {
  static async getAll(userId: string): Promise<Todo[]> {
    return todoRepo.all(userId);
  }

  static async getById(id: string, userId: string): Promise<Todo | undefined> {
    return todoRepo.get(id, userId);
  }

  static async create(input: CreateTodoInput, userId: string): Promise<Todo> {
    const todo = {
      id: uuidv4(),
      user_id: userId,
      title: input.title,
      description: input.description,
      completed: false
    };
    return todoRepo.create(todo);
  }

  static async update(id: string, userId: string, input: UpdateTodoInput): Promise<Todo | undefined> {
    return todoRepo.update(id, userId, input);
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    return todoRepo.delete(id, userId);
  }
}
