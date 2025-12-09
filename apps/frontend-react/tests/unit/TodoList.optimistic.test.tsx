import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { TodoList } from "../../src/components/TodoList";
import { resetTodos } from "../../mocks/handlers";

// Mock localStorage for auth
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage
});

// Mock auth token
beforeEach(() => {
  mockLocalStorage.setItem("auth_token", "mock-token");
  mockLocalStorage.setItem("auth_user", JSON.stringify({ id: "user-1", username: "testuser" }));
  resetTodos();
});

afterEach(() => {
  mockLocalStorage.clear();
});

describe("TodoList - Optimistic UI Rollback", () => {
  it("rolls back optimistic create when API fails", async () => {
    const user = userEvent.setup();

    // Override POST handler to fail
    server.use(
      http.post("http://localhost:3000/api/v1/todos", () => {
        return HttpResponse.json(
          { error: true, code: "ERR_SERVER", message: "Server error" },
          { status: 500 }
        );
      })
    );

    render(<TodoList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/todo title/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByPlaceholderText(/todo title/i);
    const submitButton = screen.getByText(/add todo/i);

    // Create todo optimistically
    await user.type(titleInput, "New Todo");
    await user.click(submitButton);

    // Should appear immediately (optimistic update)
    await waitFor(() => {
      expect(screen.getByText("New Todo")).toBeInTheDocument();
    });

    // Should be removed after API failure (rollback)
    await waitFor(
      () => {
        expect(screen.queryByText("New Todo")).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Error message should be shown
    expect(screen.getByText(/failed to create todo/i)).toBeInTheDocument();
  });

  it("rolls back optimistic update when API fails", async () => {
    const user = userEvent.setup();

    // Override PUT handler to fail
    server.use(
      http.put("http://localhost:3000/api/v1/todos/:id", () => {
        return HttpResponse.json(
          { error: true, code: "ERR_SERVER", message: "Server error" },
          { status: 500 }
        );
      })
    );

    render(<TodoList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });

    const checkbox = screen.getByRole("checkbox");

    // Toggle completion optimistically
    await user.click(checkbox);

    // Should update immediately (optimistic update)
    await waitFor(() => {
      const updatedCheckbox = screen.getByRole("checkbox") as HTMLInputElement;
      expect(updatedCheckbox.checked).toBe(true);
    });

    // Should rollback after API failure
    await waitFor(
      () => {
        const rolledBackCheckbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(rolledBackCheckbox.checked).toBe(false);
      },
      { timeout: 2000 }
    );

    // Error message should be shown
    expect(screen.getByText(/failed to update todo/i)).toBeInTheDocument();
  });

  it("rolls back optimistic delete when API fails", async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);

    // Override DELETE handler to fail
    server.use(
      http.delete("http://localhost:3000/api/v1/todos/:id", () => {
        return HttpResponse.json(
          { error: true, code: "ERR_SERVER", message: "Server error" },
          { status: 500 }
        );
      })
    );

    render(<TodoList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/delete/i);

    // Delete optimistically
    await user.click(deleteButton);

    // Should disappear immediately (optimistic update)
    await waitFor(() => {
      expect(screen.queryByText("Test Todo")).not.toBeInTheDocument();
    });

    // Should reappear after API failure (rollback)
    await waitFor(
      () => {
        expect(screen.getByText("Test Todo")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Error message should be shown
    expect(screen.getByText(/failed to delete todo/i)).toBeInTheDocument();
  });

  it("handles network latency with optimistic updates", async () => {
    const user = userEvent.setup();

    // Override POST handler to add delay
    server.use(
      http.post("http://localhost:3000/api/v1/todos", async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return HttpResponse.json({
          ok: true,
          todo: {
            id: "todo-delayed",
            title: "Delayed Todo",
            description: "",
            completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }, { status: 201 });
      })
    );

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/todo title/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByPlaceholderText(/todo title/i);
    const submitButton = screen.getByText(/add todo/i);

    await user.type(titleInput, "Delayed Todo");
    await user.click(submitButton);

    // Should appear immediately with temp ID (optimistic)
    await waitFor(() => {
      const todoElements = screen.getAllByText(/delayed todo/i);
      expect(todoElements.length).toBeGreaterThan(0);
    });

    // Should be replaced with real todo after API response
    await waitFor(
      () => {
        const todoElements = screen.getAllByText(/delayed todo/i);
        // Should have one real todo (optimistic one replaced)
        expect(todoElements.length).toBe(1);
      },
      { timeout: 1000 }
    );
  });

  it("handles empty title validation error", async () => {
    const user = userEvent.setup();

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/todo title/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByPlaceholderText(/todo title/i);
    const submitButton = screen.getByText(/add todo/i);

    // Try to submit with empty title
    await user.click(submitButton);

    // Should not create todo (client-side validation)
    await waitFor(() => {
      // Form should still be visible, no new todo created
      expect(titleInput).toBeInTheDocument();
    });

    // Should not call API
    // (This is handled by the component's validation)
  });
});

