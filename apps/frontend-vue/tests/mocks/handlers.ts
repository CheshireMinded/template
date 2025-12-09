import { http, HttpResponse } from "msw";

const API_BASE_URL = "http://localhost:3000";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// Mock data store
let todos: Todo[] = [
  {
    id: "1",
    title: "Test Todo",
    description: "Test description",
    completed: false,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  }
];

export const handlers = [
  http.get(`${API_BASE_URL}/api/v1/todos`, () => {
    return HttpResponse.json({
      ok: true,
      todos,
      count: todos.length
    });
  }),

  http.post(`${API_BASE_URL}/api/v1/todos`, async ({ request }) => {
    const body = await request.json() as { title: string; description?: string };
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      title: body.title,
      description: body.description,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    todos.push(newTodo);
    return HttpResponse.json({ ok: true, todo: newTodo }, { status: 201 });
  }),

  http.put(`${API_BASE_URL}/api/v1/todos/:id`, async ({ params, request }) => {
    const body = await request.json() as { title?: string; description?: string; completed?: boolean };
    const todo = todos.find((t) => t.id === params.id);
    
    if (!todo) {
      return HttpResponse.json(
        { error: true, code: "ERR_NOT_FOUND", message: "Todo not found" },
        { status: 404 }
      );
    }
    
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const updatedTodo = {
      ...todo,
      ...body,
      updated_at: new Date().toISOString()
    };
    todos = todos.map((t) => (t.id === params.id ? updatedTodo : t));
    return HttpResponse.json({ ok: true, todo: updatedTodo });
  }),

  http.delete(`${API_BASE_URL}/api/v1/todos/:id`, async ({ params }) => {
    const todo = todos.find((t) => t.id === params.id);
    
    if (!todo) {
      return HttpResponse.json(
        { error: true, code: "ERR_NOT_FOUND", message: "Todo not found" },
        { status: 404 }
      );
    }
    
    await new Promise((resolve) => setTimeout(resolve, 100));
    todos = todos.filter((t) => t.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_BASE_URL}/api/v1/auth/login`, async ({ request }) => {
    const body = await request.json() as { username: string; password: string };
    
    if (body.username === "testuser" && body.password === "testpass") {
      return HttpResponse.json({
        ok: true,
        token: "mock-jwt-token",
        user: { id: "user-1", username: "testuser" }
      });
    }
    
    return HttpResponse.json(
      { error: true, code: "ERR_UNAUTHORIZED", message: "Invalid credentials" },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE_URL}/api/v1/auth/register`, async ({ request }) => {
    const body = await request.json() as { username: string; password: string };
    
    if (body.username === "existing") {
      return HttpResponse.json(
        { error: true, code: "ERR_CONFLICT", message: "Username already exists" },
        { status: 409 }
      );
    }
    
    return HttpResponse.json({
      ok: true,
      token: "mock-jwt-token",
      user: { id: "user-2", username: body.username }
    }, { status: 201 });
  })
];

export function resetTodos() {
  todos = [
    {
      id: "1",
      title: "Test Todo",
      description: "Test description",
      completed: false,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z"
    }
  ];
}

