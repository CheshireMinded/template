import React, { useState, useEffect } from "react";
import { getAuthHeaders } from "../utils/auth";

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/v1/todos`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create a new todo (with optimistic update)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticTodo: Todo = {
      id: tempId,
      title: newTitle,
      description: newDescription || undefined,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Optimistic update: add to UI immediately
    setTodos((prev) => [...prev, optimisticTodo]);
    setNewTitle("");
    setNewDescription("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/todos`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: optimisticTodo.title,
          description: optimisticTodo.description
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      const data = await response.json();
      // Replace optimistic todo with real one from server
      setTodos((prev) => prev.map((t) => (t.id === tempId ? data.todo : t)));
    } catch (err) {
      // Rollback: remove optimistic todo on error
      setTodos((prev) => prev.filter((t) => t.id !== tempId));
      setError(err instanceof Error ? err.message : "Failed to create todo");
    }
  };

  // Update a todo (with optimistic update)
  const handleUpdate = async (id: string, updates: { title?: string; description?: string; completed?: boolean }) => {
    // Store original state for rollback
    const originalTodo = todos.find((t) => t.id === id);
    if (!originalTodo) return;

    // Optimistic update: update UI immediately
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...updates, updated_at: new Date().toISOString() }
          : t
      )
    );

    if (editingId === id) {
      setEditingId(null);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/todos/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const data = await response.json();
      // Replace with server response to ensure consistency
      setTodos((prev) => prev.map((t) => (t.id === id ? data.todo : t)));
    } catch (err) {
      // Rollback: restore original state on error
      setTodos((prev) => prev.map((t) => (t.id === id ? originalTodo : t)));
      setError(err instanceof Error ? err.message : "Failed to update todo");
    }
  };

  // Delete a todo (with optimistic update)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    // Store original state for rollback
    const originalTodo = todos.find((t) => t.id === id);
    if (!originalTodo) return;

    // Optimistic update: remove from UI immediately
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/todos/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      // Success: todo already removed optimistically
    } catch (err) {
      // Rollback: restore todo on error
      setTodos((prev) => [...prev, originalTodo].sort((a, b) => a.created_at.localeCompare(b.created_at)));
      setError(err instanceof Error ? err.message : "Failed to delete todo");
    }
  };

  // Toggle completion (uses optimistic update via handleUpdate)
  const handleToggleComplete = (todo: Todo) => {
    handleUpdate(todo.id, { completed: !todo.completed });
  };

  // Start editing
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  // Save edit
  const saveEdit = () => {
    if (!editTitle.trim()) return;
    handleUpdate(editingId!, { title: editTitle, description: editDescription || undefined });
  };

  if (loading && todos.length === 0) {
    return <div style={styles.container}>Loading todos...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todo List</h1>

      {error && (
        <div style={styles.error}>
          {error}
          <button onClick={() => setError(null)} style={styles.closeButton}>×</button>
        </div>
      )}

      {/* Create form */}
      <form onSubmit={handleCreate} style={styles.form}>
        <input
          type="text"
          placeholder="Todo title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Todo</button>
      </form>

      {/* Todo list */}
      <div style={styles.todoList}>
        {todos.length === 0 ? (
          <p style={styles.empty}>No todos yet. Create one above!</p>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} style={styles.todoItem}>
              {editingId === todo.id ? (
                <div style={styles.editForm}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description..."
                    style={styles.input}
                  />
                  <button onClick={saveEdit} style={styles.button}>Save</button>
                  <button onClick={() => setEditingId(null)} style={styles.cancelButton}>Cancel</button>
                </div>
              ) : (
                <>
                  <div style={styles.todoContent}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo)}
                      style={styles.checkbox}
                    />
                    <div style={styles.todoText}>
                      <h3 style={{ ...styles.todoTitle, textDecoration: todo.completed ? "line-through" : "none", opacity: todo.completed ? 0.6 : 1 }}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p style={styles.todoDescription}>{todo.description}</p>
                      )}
                    </div>
                  </div>
                  <div style={styles.todoActions}>
                    <button onClick={() => startEdit(todo)} style={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(todo.id)} style={styles.deleteButton}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  title: {
    color: "#e5e7eb",
    marginBottom: "2rem"
  },
  error: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer"
  },
  form: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "2rem",
    flexWrap: "wrap"
  },
  input: {
    flex: "1",
    minWidth: "200px",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    backgroundColor: "#1f2937",
    color: "#e5e7eb",
    fontSize: "1rem"
  },
  button: {
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    border: "none",
    backgroundColor: "#22c55e",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem"
  },
  todoList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  empty: {
    color: "#9ca3af",
    textAlign: "center",
    padding: "2rem"
  },
  todoItem: {
    backgroundColor: "#1f2937",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem"
  },
  todoContent: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
    flex: "1"
  },
  checkbox: {
    width: "1.25rem",
    height: "1.25rem",
    cursor: "pointer",
    marginTop: "0.25rem"
  },
  todoText: {
    flex: "1"
  },
  todoTitle: {
    margin: "0 0 0.5rem 0",
    color: "#e5e7eb",
    fontSize: "1.125rem"
  },
  todoDescription: {
    margin: "0",
    color: "#9ca3af",
    fontSize: "0.875rem"
  },
  todoActions: {
    display: "flex",
    gap: "0.5rem"
  },
  editButton: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontSize: "0.875rem"
  },
  deleteButton: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    backgroundColor: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontSize: "0.875rem"
  },
  cancelButton: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    backgroundColor: "transparent",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: "0.875rem"
  },
  editForm: {
    display: "flex",
    gap: "0.5rem",
    flex: "1",
    flexWrap: "wrap"
  }
};

