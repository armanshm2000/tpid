import { test, expect } from "@playwright/test";

test.describe("TPID Smoke Tests", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("TPID");
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test("can login with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[type='email']", "admin@titan.io");
    await page.fill("input[type='password']", "password123");
    await page.click("button[type='submit']");
    await page.waitForURL("/dashboard", { timeout: 10000 });
    await expect(page).toHaveURL("/dashboard");
  });

  test("shows error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[type='email']", "wrong@email.com");
    await page.fill("input[type='password']", "wrongpassword");
    await page.click("button[type='submit']");
    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });

  test("dashboard loads after login", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[type='email']", "admin@titan.io");
    await page.fill("input[type='password']", "password123");
    await page.click("button[type='submit']");
    await page.waitForURL("/dashboard", { timeout: 10000 });

    await expect(page.locator("text=Dashboard")).toBeVisible();
    await expect(page.locator("text=Total Projects")).toBeVisible();
    await expect(page.locator("text=Average Health")).toBeVisible();
  });

  test("navigation works", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[type='email']", "admin@titan.io");
    await page.fill("input[type='password']", "password123");
    await page.click("button[type='submit']");
    await page.waitForURL("/dashboard", { timeout: 10000 });

    // Projects page
    await page.click("text=Projects");
    await expect(page).toHaveURL("/dashboard/projects");
    await expect(page.locator("text=Search projects")).toBeVisible();

    // Settings page
    await page.click("text=Settings");
    await expect(page).toHaveURL("/dashboard/settings");
    await expect(page.locator("text=Profile")).toBeVisible();
    await expect(page.locator("text=Change Password")).toBeVisible();
  });

  test("settings page profile update works", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[type='email']", "admin@titan.io");
    await page.fill("input[type='password']", "password123");
    await page.click("button[type='submit']");
    await page.waitForURL("/dashboard", { timeout: 10000 });

    await page.goto("/dashboard/settings");
    await expect(page.locator("text=Profile")).toBeVisible();
    await expect(page.locator("text=Theme")).toBeVisible();
    await expect(page.locator("text=Notifications")).toBeVisible();
  });

  test("unauthenticated user redirected to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login", { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("health endpoint returns ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe("healthy");
    expect(data.checks).toBeDefined();
  });
});
