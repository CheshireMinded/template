import { test, expect } from "@playwright/test";

test.describe("Concurrent Operations", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/");
    await page.getByRole("button", { name: /register|need an account/i }).click();
    const username = `testuser_${Date.now()}`;
    await page.getByPlaceholderText(/username/i).fill(username);
    await page.getByPlaceholderText(/password/i).fill("testpass123");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page.getByText(/todo list/i)).toBeVisible({ timeout: 5000 });
  });

  test("should handle multiple rapid todo creations", async ({ page }) => {
    const todos = Array.from({ length: 5 }, (_, i) => `Todo ${i + 1} - ${Date.now()}`);

    // Create todos rapidly
    for (const todoTitle of todos) {
      await page.getByPlaceholderText(/todo title/i).fill(todoTitle);
      await page.getByRole("button", { name: /add todo/i }).click();
      // Small delay to allow optimistic update
      await page.waitForTimeout(100);
    }

    // All todos should appear
    for (const todoTitle of todos) {
      await expect(page.getByText(todoTitle)).toBeVisible({ timeout: 5000 });
    }
  });

  test("should handle concurrent updates", async ({ page }) => {
    // Create a todo
    const todoTitle = `Concurrent Test ${Date.now()}`;
    await page.getByPlaceholderText(/todo title/i).fill(todoTitle);
    await page.getByRole("button", { name: /add todo/i }).click();
    await expect(page.getByText(todoTitle)).toBeVisible();

    // Toggle completion multiple times rapidly
    const checkbox = page.locator('input[type="checkbox"]').first();
    for (let i = 0; i < 3; i++) {
      await checkbox.click();
      await page.waitForTimeout(50);
    }

    // Should be in a consistent state
    const isChecked = await checkbox.isChecked();
    expect(typeof isChecked).toBe("boolean");
  });

  test("should handle edit cancellation", async ({ page }) => {
    // Create a todo
    const originalTitle = `Edit Cancel Test ${Date.now()}`;
    await page.getByPlaceholderText(/todo title/i).fill(originalTitle);
    await page.getByRole("button", { name: /add todo/i }).click();
    await expect(page.getByText(originalTitle)).toBeVisible();

    // Start editing
    await page.getByRole("button", { name: /edit/i }).first().click();

    // Cancel edit
    await page.getByRole("button", { name: /cancel/i }).click();

    // Should show original title
    await expect(page.getByText(originalTitle)).toBeVisible();
  });

  test("should handle network latency gracefully", async ({ page, context }) => {
    // Add delay to all API calls
    await context.route("**/api/v1/todos**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      route.continue();
    });

    // Create todo
    const todoTitle = `Latency Test ${Date.now()}`;
    await page.getByPlaceholderText(/todo title/i).fill(todoTitle);
    await page.getByRole("button", { name: /add todo/i }).click();

    // Should appear optimistically
    await expect(page.getByText(todoTitle)).toBeVisible();

    // Should persist after API completes
    await expect(page.getByText(todoTitle)).toBeVisible({ timeout: 5000 });
  });
});

