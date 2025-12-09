<template>
  <div class="container">
    <h1 class="title">Todo List (Vue)</h1>

    <div v-if="error" class="error">
      {{ error }}
      <button @click="error = null" class="close-button">×</button>
    </div>

    <!-- Create form -->
    <form @submit.prevent="handleCreate" class="form">
      <input
        type="text"
        placeholder="Todo title..."
        v-model="newTitle"
        class="input"
        required
      />
      <input
        type="text"
        placeholder="Description (optional)..."
        v-model="newDescription"
        class="input"
      />
      <button type="submit" class="button">Add Todo</button>
    </form>

    <!-- Todo list -->
    <div class="todo-list">
      <p v-if="loading && todos.length === 0" class="empty">Loading todos...</p>
      <p v-else-if="todos.length === 0" class="empty">No todos yet. Create one above!</p>
      <div v-else v-for="todo in todos" :key="todo.id" class="todo-item">
        <div v-if="editingId === todo.id" class="edit-form">
          <input
            type="text"
            v-model="editTitle"
            class="input"
          />
          <input
            type="text"
            v-model="editDescription"
            placeholder="Description..."
            class="input"
          />
          <button @click="saveEdit" class="button">Save</button>
          <button @click="editingId = null" class="cancel-button">Cancel</button>
        </div>
        <template v-else>
          <div class="todo-content">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="handleToggleComplete(todo)"
              class="checkbox"
            />
            <div class="todo-text">
              <h3
                class="todo-title"
                :style="{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  opacity: todo.completed ? 0.6 : 1
                }"
              >
                {{ todo.title }}
              </h3>
              <p v-if="todo.description" class="todo-description">{{ todo.description }}</p>
            </div>
          </div>
          <div class="todo-actions">
            <button @click="startEdit(todo)" class="edit-button">Edit</button>
            <button @click="handleDelete(todo.id)" class="delete-button">Delete</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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

const todos = ref<Todo[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const newTitle = ref("");
const newDescription = ref("");
const editingId = ref<string | null>(null);
const editTitle = ref("");
const editDescription = ref("");

// Fetch all todos
const fetchTodos = async () => {
  try {
    loading.value = true;
    error.value = null;
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
    todos.value = data.todos || [];
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred";
  } finally {
    loading.value = false;
  }
};

// Create a new todo (with optimistic update)
const handleCreate = async () => {
  if (!newTitle.value.trim()) return;

  const tempId = `temp-${Date.now()}`;
  const optimisticTodo: Todo = {
    id: tempId,
    title: newTitle.value,
    description: newDescription.value || undefined,
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Optimistic update: add to UI immediately
  todos.value = [...todos.value, optimisticTodo];
  const titleToCreate = newTitle.value;
  const descToCreate = newDescription.value;
  newTitle.value = "";
  newDescription.value = "";

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/todos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: titleToCreate,
        description: descToCreate || undefined
      })
    });

    if (!response.ok) {
      throw new Error("Failed to create todo");
    }

    const data = await response.json();
    // Replace optimistic todo with real one from server
    todos.value = todos.value.map((t) => (t.id === tempId ? data.todo : t));
  } catch (err) {
    // Rollback: remove optimistic todo on error
    todos.value = todos.value.filter((t) => t.id !== tempId);
    error.value = err instanceof Error ? err.message : "Failed to create todo";
  }
};

// Update a todo (with optimistic update)
const handleUpdate = async (id: string, updates: { title?: string; description?: string; completed?: boolean }) => {
  // Store original state for rollback
  const originalTodo = todos.value.find((t) => t.id === id);
  if (!originalTodo) return;

  // Optimistic update: update UI immediately
  todos.value = todos.value.map((t) =>
    t.id === id
      ? { ...t, ...updates, updated_at: new Date().toISOString() }
      : t
  );

  if (editingId.value === id) {
    editingId.value = null;
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
    todos.value = todos.value.map((t) => (t.id === id ? data.todo : t));
  } catch (err) {
    // Rollback: restore original state on error
    todos.value = todos.value.map((t) => (t.id === id ? originalTodo : t));
    error.value = err instanceof Error ? err.message : "Failed to update todo";
  }
};

// Delete a todo (with optimistic update)
const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this todo?")) return;

  // Store original state for rollback
  const originalTodo = todos.value.find((t) => t.id === id);
  if (!originalTodo) return;

  // Optimistic update: remove from UI immediately
  todos.value = todos.value.filter((t) => t.id !== id);

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
    todos.value = [...todos.value, originalTodo].sort((a, b) => a.created_at.localeCompare(b.created_at));
    error.value = err instanceof Error ? err.message : "Failed to delete todo";
  }
};

// Toggle completion (uses optimistic update via handleUpdate)
const handleToggleComplete = (todo: Todo) => {
  handleUpdate(todo.id, { completed: !todo.completed });
};

// Start editing
const startEdit = (todo: Todo) => {
  editingId.value = todo.id;
  editTitle.value = todo.title;
  editDescription.value = todo.description || "";
};

// Save edit
const saveEdit = () => {
  if (!editTitle.value.trim()) return;
  handleUpdate(editingId.value!, { title: editTitle.value, description: editDescription.value || undefined });
};

onMounted(() => {
  fetchTodos();
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.title {
  color: #e5e7eb;
  margin-bottom: 2rem;
}

.error {
  background-color: #ef4444;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.input {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  background-color: #1f2937;
  color: #e5e7eb;
  font-size: 1rem;
}

.button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background-color: #22c55e;
  color: #0f172a;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty {
  color: #9ca3af;
  text-align: center;
  padding: 2rem;
}

.todo-item {
  background-color: #1f2937;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.todo-content {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex: 1;
}

.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  margin-top: 0.25rem;
}

.todo-text {
  flex: 1;
}

.todo-title {
  margin: 0 0 0.5rem 0;
  color: #e5e7eb;
  font-size: 1.125rem;
}

.todo-description {
  margin: 0;
  color: #9ca3af;
  font-size: 0.875rem;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.delete-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background-color: #ef4444;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.cancel-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  background-color: transparent;
  color: #e5e7eb;
  cursor: pointer;
  font-size: 0.875rem;
}

.edit-form {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  flex-wrap: wrap;
}
</style>

