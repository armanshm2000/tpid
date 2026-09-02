import { test, expect } from "@playwright/test";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.fill("input[type='email']", "admin@titan.io");
  await page.fill("input[type='password']", "password123");
  await page.click("button[type='submit']");
  await page.waitForURL("/dashboard", { timeout: 10000 });
}

test.describe("Navigation", () => {
  test("sidebar shows all navigation items", async ({ page }) => {
    await login(page);

    await expect(page.locator("text=Dashboard")).toBeVisible();
    await expect(page.locator("text=Projects")).toBeVisible();
    await expect(page.locator("text=Architecture")).toBeVisible();
    await expect(page.locator("text=Contracts")).toBeVisible();
    await expect(page.locator("text=Evidence")).toBeVisible();
    await expect(page.locator("text=Reports")).toBeVisible();
    await expect(page.locator("text=Search")).toBeVisible();
    await expect(page.locator("text=Settings")).toBeVisible();
  });

  test("architecture page loads", async ({ page }) => {
    await login(page);
    await page.click("text=Architecture");
    await expect(page).toHaveURL("/dashboard/architecture");
    await expect(page.locator("text=Total")).toBeVisible();
  });

  test("contracts page loads", async ({ page }) => {
    await login(page);
    await page.click("text=Contracts");
    await expect(page).toHaveURL("/dashboard/contracts");
    await expect(page.locator("text=Total")).toBeVisible();
  });

  test("evidence page loads", async ({ page }) => {
    await login(page);
    await page.click("text=Evidence");
    await expect(page).toHaveURL("/dashboard/evidence");
    await expect(page.locator("text=Upload Evidence")).toBeVisible();
  });

  test("reports page loads", async ({ page }) => {
    await login(page);
    await page.click("text=Reports");
    await expect(page).toHaveURL("/dashboard/reports");
  });

  test("search page loads and can search", async ({ page }) => {
    await login(page);
    await page.click("text=Search");
    await expect(page).toHaveURL("/dashboard/search");

    await page.fill("input[placeholder*='Search']", "Titan");
    await page.click("button:text('Search')");
    await expect(page.locator("text=result")).toBeVisible();
  });
});

test.describe("Settings", () => {
  test("all settings sections are visible", async ({ page }) => {
    await login(page);
    await page.goto("/dashboard/settings");

    await expect(page.locator("text=Profile")).toBeVisible();
    await expect(page.locator("text=Change Password")).toBeVisible();
    await expect(page.locator("text=Notifications")).toBeVisible();
    await expect(page.locator("text=Theme")).toBeVisible();
  });

  test("theme options are visible", async ({ page }) => {
    await login(page);
    await page.goto("/dashboard/settings");

    await expect(page.locator("text=light")).toBeVisible();
    await expect(page.locator("text=dark")).toBeVisible();
    await expect(page.locator("text=system")).toBeVisible();
  });

  test("notification toggles work", async ({ page }) => {
    await login(page);
    await page.goto("/dashboard/settings");

    await expect(page.locator("text=Email notifications")).toBeVisible();
    await expect(page.locator("text=Browser notifications")).toBeVisible();
    await expect(page.locator("text=Weekly digest")).toBeVisible();
  });
});

test.describe("Health Endpoint", () => {
  test("returns healthy status", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe("healthy");
    expect(data.version).toBeDefined();
    expect(data.checks.database).toBe("ok");
  });
});

test.describe("Projects", () => {
  test("projects list shows in table", async ({ page }) => {
    await login(page);
    await page.click("text=Projects");
    await expect(page).toHaveURL("/dashboard/projects");

    // Should have filter buttons
    await expect(page.locator("text=All")).toBeVisible();
    await expect(page.locator("text=COMPLETED")).toBeVisible();
  });

  test("can filter projects", async ({ page }) => {
    await login(page);
    await page.click("text=Projects");

    await page.click("button:text('COMPLETED')");
    // Table should still be visible
    await expect(page.locator("table")).toBeVisible();
  });
});
