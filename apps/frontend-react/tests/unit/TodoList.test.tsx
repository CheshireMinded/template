import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "../../src/components/TodoList";

// Mock fetch
global.fetch = jest.fn();
// Mock window.confirm
window.confirm = jest.fn(() => true);

describe("<TodoList />", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (window.confirm as jest.Mock).mockClear();
  });

  it("renders loading state initially", async () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ todos: [], count: 0 })
      })
    );

    render(<TodoList />);
    
    // Should show loading or empty state
    await waitFor(() => {
      expect(screen.queryByText(/loading todos/i)).not.toBeInTheDocument();
    });
  });

  it("renders todos after fetching", async () => {
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo",
        description: "Test description",
        completed: false,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01"
      }
    ];

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/api/v1/todos") && !url.includes("/api/v1/todos/")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ todos: mockTodos, count: 1 })
        });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });
  });

  it("renders empty state when no todos", async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/api/v1/todos") && !url.includes("/api/v1/todos/")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ todos: [], count: 0 })
        });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });
  });

  it("creates a new todo when form is submitted", async () => {
    const user = userEvent.setup();
    let fetchCallCount = 0;

    (global.fetch as jest.Mock).mockImplementation((url: string, options?: RequestInit) => {
      if (url.includes("/api/v1/todos") && options?.method === "POST") {
        const newTodo = {
          id: "new-id",
          title: "New Todo",
          description: "",
          completed: false,
          createdAt: "2025-01-01",
          updatedAt: "2025-01-01"
        };
        return Promise.resolve({
          ok: true,
          json: async () => ({ ok: true, todo: newTodo })
        });
      }
      if (url.includes("/api/v1/todos") && !url.includes("/api/v1/todos/") && !options) {
        fetchCallCount++;
        return Promise.resolve({
          ok: true,
          json: async () => ({ todos: fetchCallCount === 1 ? [] : [{ id: "new-id", title: "New Todo", completed: false, createdAt: "2025-01-01", updatedAt: "2025-01-01" }], count: fetchCallCount === 1 ? 0 : 1 })
        });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/todo title/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByPlaceholderText(/todo title/i);
    const submitButton = screen.getByText(/add todo/i);

    await user.type(titleInput, "New Todo");
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/todos"),
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("toggles todo completion when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo",
        description: "Test description",
        completed: false,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01"
      }
    ];

    (global.fetch as jest.Mock).mockImplementation((url: string, options?: RequestInit) => {
      if (url.includes("/api/v1/todos/1") && options?.method === "PUT") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ ok: true, todo: { ...mockTodos[0], completed: true } })
        });
      }
      if (url.includes("/api/v1/todos") && !url.includes("/api/v1/todos/") && !options) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ todos: mockTodos, count: 1 })
        });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/todos/1"),
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  it("enters edit mode when edit button is clicked", async () => {
    const user = userEvent.setup();
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo",
        description: "Test description",
        completed: false,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01"
      }
    ];

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/api/v1/todos") && !url.includes("/api/v1/todos/")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ todos: mockTodos, count: 1 })
        });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });

    const editButton = screen.getByText(/edit/i);
    await user.click(editButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Todo")).toBeInTheDocument();
      expect(screen.getByText(/save/i)).toBeInTheDocument();
    });
  });

  it("deletes a todo when delete button is clicked and confirmed", async () => {
    const user = userEvent.setup();
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo",
        description: "Test description",
        completed: false,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01"
      }
    ];

    (global.fetch as jest.Mock).mockImplementation((url: string, options?: RequestInit) => {
      if (url.includes("/api/v1/todos/1") && options?.method === "DELETE") {
        return Promise.resolve({ ok: true, status: 204 });
      }
      if (url.includes("/api/v1/todos") && !url.includes("/api/v1/todos/") && !options) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ todos: mockTodos, count: 1 })
        });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/delete/i);
    await user.click(deleteButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/todos/1"),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  it("does not delete when confirmation is cancelled", async () => {
    const user = userEvent.setup();
    (window.confirm as jest.Mock).mockReturnValue(false);

    const mockTodos = [
      {
        id: "1",
        title: "Test Todo",
        completed: false,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01"
      }
    ];

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/api/v1/todos") && !url.includes("/api/v1/todos/")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ todos: mockTodos, count: 1 })
        });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/delete/i);
    await user.click(deleteButton);

    // Should not call DELETE endpoint
    const deleteCalls = (global.fetch as jest.Mock).mock.calls.filter(
      (call: any[]) => call[1]?.method === "DELETE"
    );
    expect(deleteCalls.length).toBe(0);
  });
});

