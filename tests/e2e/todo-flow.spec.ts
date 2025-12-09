import { test, expect } from "@playwright/test";

test.describe("Todo Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/");
    
    // Mock auth or use real login
    const token = "mock-token";
    const user = JSON.stringify({ id: "user-1", username: "testuser" });
    await page.evaluate(([t, u]) => {
      localStorage.setItem("auth_token", t);
      localStorage.setItem("auth_user", u);
    }, [token, user]);

    await page.goto("/");
    await expect(page.getByText(/todo list/i)).toBeVisible({ timeout: 5000 });
  });

  test("should display todos after loading", async ({ page }) => {
    await expect(page.getByText(/todo list/i)).toBeVisible();
    // Should show either todos or empty state
    const hasTodos = await page.getByText(/no todos yet/i).isVisible().catch(() => false);
    const hasTodoItems = await page.locator(".todo-item, [class*='todo']").count() > 0;
    expect(hasTodos || hasTodoItems).toBe(true);
  });

  test("should create a new todo", async ({ page }) => {
    const todoTitle = `Test Todo ${Date.now()}`;

    // Fill create form
    await page.getByPlaceholderText(/todo title/i).fill(todoTitle);
    await page.getByPlaceholderText(/description/i).fill("Test description");
    await page.getByRole("button", { name: /add todo/i }).click();

    // Should appear in list (optimistic update)
    await expect(page.getByText(todoTitle)).toBeVisible({ timeout: 3000 });
  });

  test("should toggle todo completion", async ({ page }) => {
    // Create a todo first
    const todoTitle = `Toggle Test ${Date.now()}`;
    await page.getByPlaceholderText(/todo title/i).fill(todoTitle);
    await page.getByRole("button", { name: /add todo/i }).click();

    await expect(page.getByText(todoTitle)).toBeVisible();

    // Find checkbox and toggle
    const checkbox = page.locator(`input[type="checkbox"]`).first();
    await checkbox.click();

    // Should be checked (optimistic update)
    await expect(checkbox).toBeChecked();
  });

  test("should edit a todo", async ({ page }) => {
    // Create a todo first
    const originalTitle = `Edit Test ${Date.now()}`;
    await page.getByPlaceholderText(/todo title/i).fill(originalTitle);
    await page.getByRole("button", { name: /add todo/i }).click();

    await expect(page.getByText(originalTitle)).toBeVisible();

    // Click edit button
    await page.getByRole("button", { name: /edit/i }).first().click();

    // Should show edit form
    const editInput = page.locator('input[type="text"]').first();
    await expect(editInput).toHaveValue(originalTitle);

    // Update title
    const newTitle = `${originalTitle} - Updated`;
    await editInput.clear();
    await editInput.fill(newTitle);
    await page.getByRole("button", { name: /save/i }).click();

    // Should show updated title
    await expect(page.getByText(newTitle)).toBeVisible({ timeout: 3000 });
  });

  test("should delete a todo", async ({ page }) => {
    // Create a todo first
    const todoTitle = `Delete Test ${Date.now()}`;
    await page.getByPlaceholderText(/todo title/i).fill(todoTitle);
    await page.getByRole("button", { name: /add todo/i }).click();

    await expect(page.getByText(todoTitle)).toBeVisible();

    // Click delete button and confirm
    page.on("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: /delete/i }).first().click();

    // Should be removed (optimistic update)
    await expect(page.getByText(todoTitle)).not.toBeVisible({ timeout: 3000 });
  });

  test("should handle empty title validation", async ({ page }) => {
    // Try to submit empty form
    await page.getByRole("button", { name: /add todo/i }).click();

    // Form should still be visible (not submitted)
    await expect(page.getByPlaceholderText(/todo title/i)).toBeVisible();
  });

  test("should show error message on API failure", async ({ page, context }) => {
    // Intercept and fail API calls
    await context.route("**/api/v1/todos", (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: true, message: "Server error" })
      });
    });

    await page.reload();

    // Should show error message
    await expect(page.getByText(/failed to fetch todos/i)).toBeVisible({ timeout: 3000 });
  });

  test("should rollback optimistic update on create failure", async ({ page, context }) => {
    // Create todo first
    const todoTitle = `Rollback Test ${Date.now()}`;
    
    // Intercept POST to fail
    let postIntercepted = false;
    await context.route("**/api/v1/todos", async (route) => {
      if (route.request().method() === "POST" && !postIntercepted) {
        postIntercepted = true;
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: true, message: "Server error" })
        });
      } else {
        route.continue();
      }
    });

    await page.getByPlaceholderText(/todo title/i).fill(todoTitle);
    await page.getByRole("button", { name: /add todo/i }).click();

    // Should appear optimistically
    await expect(page.getByText(todoTitle)).toBeVisible();

    // Should disappear after rollback
    await expect(page.getByText(todoTitle)).not.toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/failed to create todo/i)).toBeVisible();
  });

  test("should rollback optimistic update on delete failure", async ({ page, context }) => {
    // Create todo first
    const todoTitle = `Delete Rollback Test ${Date.now()}`;
    await page.getByPlaceholderText(/todo title/i).fill(todoTitle);
    await page.getByRole("button", { name: /add todo/i }).click();
    await expect(page.getByText(todoTitle)).toBeVisible();

    // Intercept DELETE to fail
    let deleteIntercepted = false;
    await context.route("**/api/v1/todos/*", async (route) => {
      if (route.request().method() === "DELETE" && !deleteIntercepted) {
        deleteIntercepted = true;
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: true, message: "Server error" })
        });
      } else {
        route.continue();
      }
    });

    // Delete todo
    page.on("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: /delete/i }).first().click();

    // Should disappear optimistically
    await expect(page.getByText(todoTitle)).not.toBeVisible();

    // Should reappear after rollback
    await expect(page.getByText(todoTitle)).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/failed to delete todo/i)).toBeVisible();
  });
});

