import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should register a new user", async ({ page }) => {
    await page.goto("/");

    // Should show login form
    await expect(page.getByText(/login/i)).toBeVisible();

    // Switch to register
    await page.getByRole("button", { name: /register|need an account/i }).click();
    await expect(page.getByText(/register/i)).toBeVisible();

    // Fill registration form
    const username = `testuser_${Date.now()}`;
    await page.getByPlaceholderText(/username/i).fill(username);
    await page.getByPlaceholderText(/password/i).fill("testpass123");
    await page.getByRole("button", { name: /register/i }).click();

    // Should redirect to todo list after successful registration
    await expect(page.getByText(/todo list/i)).toBeVisible({ timeout: 5000 });
  });

  test("should login with existing user", async ({ page }) => {
    // First register a user
    await page.goto("/");
    await page.getByRole("button", { name: /register|need an account/i }).click();
    const username = `testuser_${Date.now()}`;
    await page.getByPlaceholderText(/username/i).fill(username);
    await page.getByPlaceholderText(/password/i).fill("testpass123");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page.getByText(/todo list/i)).toBeVisible({ timeout: 5000 });

    // Logout
    await page.getByRole("button", { name: /logout/i }).click();
    await expect(page.getByText(/login/i)).toBeVisible();

    // Login again
    await page.getByPlaceholderText(/username/i).fill(username);
    await page.getByPlaceholderText(/password/i).fill("testpass123");
    await page.getByRole("button", { name: /login/i }).click();

    // Should be logged in
    await expect(page.getByText(/todo list/i)).toBeVisible({ timeout: 5000 });
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholderText(/username/i).fill("nonexistent");
    await page.getByPlaceholderText(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /login/i }).click();

    // Should show error message
    await expect(page.getByText(/invalid credentials|failed/i)).toBeVisible({ timeout: 3000 });
  });

  test("should prevent duplicate username registration", async ({ page }) => {
    await page.goto("/");

    // Register first user
    await page.getByRole("button", { name: /register|need an account/i }).click();
    const username = `testuser_${Date.now()}`;
    await page.getByPlaceholderText(/username/i).fill(username);
    await page.getByPlaceholderText(/password/i).fill("testpass123");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page.getByText(/todo list/i)).toBeVisible({ timeout: 5000 });

    // Logout
    await page.getByRole("button", { name: /logout/i }).click();

    // Try to register with same username
    await page.getByRole("button", { name: /register|need an account/i }).click();
    await page.getByPlaceholderText(/username/i).fill(username);
    await page.getByPlaceholderText(/password/i).fill("testpass123");
    await page.getByRole("button", { name: /register/i }).click();

    // Should show error
    await expect(page.getByText(/already exists|username/i)).toBeVisible({ timeout: 3000 });
  });

  test("should persist login state on page reload", async ({ page }) => {
    // Register and login
    await page.goto("/");
    await page.getByRole("button", { name: /register|need an account/i }).click();
    const username = `testuser_${Date.now()}`;
    await page.getByPlaceholderText(/username/i).fill(username);
    await page.getByPlaceholderText(/password/i).fill("testpass123");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page.getByText(/todo list/i)).toBeVisible({ timeout: 5000 });

    // Reload page
    await page.reload();

    // Should still be logged in
    await expect(page.getByText(/todo list/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/login/i)).not.toBeVisible();
  });
});
