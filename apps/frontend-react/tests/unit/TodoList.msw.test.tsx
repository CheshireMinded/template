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

describe("<TodoList /> with MSW", () => {
  it("renders todos after fetching", async () => {
    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });
  });

  it("creates a new todo successfully", async () => {
    const user = userEvent.setup();

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/todo title/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByPlaceholderText(/todo title/i);
    const submitButton = screen.getByText(/add todo/i);

    await user.type(titleInput, "New Todo");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("New Todo")).toBeInTheDocument();
    });
  });

  it("updates a todo successfully", async () => {
    const user = userEvent.setup();

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    await waitFor(() => {
      const updatedCheckbox = screen.getByRole("checkbox") as HTMLInputElement;
      expect(updatedCheckbox.checked).toBe(true);
    });
  });

  it("deletes a todo successfully", async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/delete/i);
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Test Todo")).not.toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    // Override GET handler to return error
    server.use(
      http.get("http://localhost:3000/api/v1/todos", () => {
        return HttpResponse.json(
          { error: true, code: "ERR_SERVER", message: "Server error" },
          { status: 500 }
        );
      })
    );

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch todos/i)).toBeInTheDocument();
    });
  });

  it("handles 401 unauthorized error", async () => {
    // Override GET handler to return 401
    server.use(
      http.get("http://localhost:3000/api/v1/todos", () => {
        return HttpResponse.json(
          { error: true, code: "ERR_UNAUTHORIZED", message: "Unauthorized" },
          { status: 401 }
        );
      })
    );

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
    });
  });
});

