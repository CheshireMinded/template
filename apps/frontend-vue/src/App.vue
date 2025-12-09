<template>
  <main class="page">
    <h1>Vue Frontend</h1>
    <p>{{ message }}</p>
    <button class="btn" @click="onClick">Click me</button>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const message = ref("Hello from Vue frontend!");

const onClick = () => {
  message.value = "You clicked the Vue button!";
};
</script>

<style>
body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  background: #020617;
  color: #e5e7eb;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: none;
  background: #22c55e;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
}
</style>

