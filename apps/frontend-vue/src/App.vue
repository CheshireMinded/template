<template>
  <main class="page">
    <div v-if="loading" class="loading">Loading...</div>
    <template v-else>
      <div v-if="authenticated" class="authenticated">
        <div class="header">
          <span class="user-info">Logged in as: {{ user?.username }}</span>
          <button @click="handleLogout" class="logout-button">Logout</button>
        </div>
        <TodoList />
      </div>
      <Login v-else :on-login="handleLogin" />
    </template>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TodoList from "./components/TodoList.vue";
import Login from "./components/Login.vue";
import { isAuthenticated, getAuthUser, removeAuthToken, type AuthUser } from "./utils/auth";

const authenticated = ref(false);
const user = ref<AuthUser | null>(null);
const loading = ref(true);

onMounted(() => {
  if (isAuthenticated()) {
    const authUser = getAuthUser();
    if (authUser) {
      user.value = authUser;
      authenticated.value = true;
    } else {
      removeAuthToken();
    }
  }
  loading.value = false;
});

const handleLogin = (authUser: AuthUser) => {
  user.value = authUser;
  authenticated.value = true;
};

const handleLogout = () => {
  removeAuthToken();
  user.value = null;
  authenticated.value = false;
};
</script>

<style>
body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.page {
  min-height: 100vh;
  background: #020617;
  color: #e5e7eb;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.25rem;
}

.authenticated {
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #374151;
}

.user-info {
  color: #9ca3af;
}

.logout-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  background-color: #1f2937;
  color: #e5e7eb;
  cursor: pointer;
  font-size: 0.875rem;
}
</style>
