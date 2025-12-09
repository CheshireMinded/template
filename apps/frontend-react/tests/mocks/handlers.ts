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
  // GET /api/v1/todos
  http.get(`${API_BASE_URL}/api/v1/todos`, () => {
    return HttpResponse.json({
      ok: true,
      todos,
      count: todos.length
    });
  }),

  // GET /api/v1/todos/:id
  http.get(`${API_BASE_URL}/api/v1/todos/:id`, ({ params }) => {
    const todo = todos.find((t) => t.id === params.id);
    if (!todo) {
      return HttpResponse.json(
        { error: true, code: "ERR_NOT_FOUND", message: "Todo not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json({ ok: true, todo });
  }),

  // POST /api/v1/todos
  http.post(`${API_BASE_URL}/api/v1/todos`, async ({ request }) => {
    const body = await request.json() as { title: string; description?: string };
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Simulate failure scenario (uncomment to test rollback)
    // if (body.title === "Fail Create") {
    //   return HttpResponse.json(
    //     { error: true, code: "ERR_SERVER", message: "Server error" },
    //     { status: 500 }
    //   );
    // }
    
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

  // PUT /api/v1/todos/:id
  http.put(`${API_BASE_URL}/api/v1/todos/:id`, async ({ params, request }) => {
    const body = await request.json() as { title?: string; description?: string; completed?: boolean };
    const todo = todos.find((t) => t.id === params.id);
    
    if (!todo) {
      return HttpResponse.json(
        { error: true, code: "ERR_NOT_FOUND", message: "Todo not found" },
        { status: 404 }
      );
    }
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Simulate failure scenario (uncomment to test rollback)
    // if (body.title === "Fail Update") {
    //   return HttpResponse.json(
    //     { error: true, code: "ERR_SERVER", message: "Server error" },
    //     { status: 500 }
    //   );
    // }
    
    const updatedTodo = {
      ...todo,
      ...body,
      updated_at: new Date().toISOString()
    };
    todos = todos.map((t) => (t.id === params.id ? updatedTodo : t));
    return HttpResponse.json({ ok: true, todo: updatedTodo });
  }),

  // DELETE /api/v1/todos/:id
  http.delete(`${API_BASE_URL}/api/v1/todos/:id`, async ({ params }) => {
    const todo = todos.find((t) => t.id === params.id);
    
    if (!todo) {
      return HttpResponse.json(
        { error: true, code: "ERR_NOT_FOUND", message: "Todo not found" },
        { status: 404 }
      );
    }
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Simulate failure scenario (uncomment to test rollback)
    // if (todo.title === "Fail Delete") {
    //   return HttpResponse.json(
    //     { error: true, code: "ERR_SERVER", message: "Server error" },
    //     { status: 500 }
    //   );
    // }
    
    todos = todos.filter((t) => t.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  // POST /api/v1/auth/login
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

  // POST /api/v1/auth/register
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

// Helper to reset mock data
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

// Helper to simulate network failure
export function simulateNetworkFailure(shouldFail: boolean) {
  // This would be used with MSW's context to override handlers
  // For now, we'll use it in test setup
}

