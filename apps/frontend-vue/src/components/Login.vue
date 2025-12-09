<template>
  <div class="container">
    <div class="card">
      <h1 class="title">{{ isRegister ? "Register" : "Login" }}</h1>
      <div v-if="error" class="error">{{ error }}</div>
      <form @submit.prevent="handleSubmit" class="form">
        <input
          type="text"
          placeholder="Username"
          v-model="username"
          class="input"
          required
          autocomplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          v-model="password"
          class="input"
          required
          :autocomplete="isRegister ? 'new-password' : 'current-password'"
          :minlength="isRegister ? 6 : undefined"
        />
        <button type="submit" class="button" :disabled="loading">
          {{ loading ? "Loading..." : isRegister ? "Register" : "Login" }}
        </button>
      </form>
      <button @click="toggleMode" class="switch-button">
        {{ isRegister ? "Already have an account? Login" : "Don't have an account? Register" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { setAuthToken, setAuthUser, type AuthUser } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const props = defineProps<{
  onLogin: (user: AuthUser) => void;
}>();

const username = ref("");
const password = ref("");
const isRegister = ref(false);
const error = ref<string | null>(null);
const loading = ref(false);

const toggleMode = () => {
  isRegister.value = !isRegister.value;
  error.value = null;
};

const handleSubmit = async () => {
  error.value = null;
  loading.value = true;

  try {
    const endpoint = isRegister.value ? "/api/v1/auth/register" : "/api/v1/auth/login";
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Authentication failed");
    }

    const data = await response.json();
    setAuthToken(data.token);
    setAuthUser(data.user);
    props.onLogin(data.user);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.card {
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  width: 100%;
  max-width: 400px;
}

.title {
  color: #e5e7eb;
  margin-bottom: 1.5rem;
  text-align: center;
}

.error {
  background-color: #ef4444;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  background-color: #111827;
  color: #e5e7eb;
  font-size: 1rem;
}

.button {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background-color: #22c55e;
  color: #0f172a;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-button {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  background-color: transparent;
  color: #9ca3af;
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
  width: 100%;
}
</style>

