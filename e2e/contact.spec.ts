import { test, expect } from "@playwright/test";

test("contact form is visible with all required fields", async ({ page }) => {
  await page.goto("/");

  const form = page.locator("form");
  await form.scrollIntoViewIfNeeded();

  await expect(form.getByRole("textbox", { name: /from/i })).toBeVisible();
  await expect(form.getByRole("textbox", { name: /reply-to/i })).toBeVisible();
  await expect(form.getByRole("textbox", { name: /message/i })).toBeVisible();
  await expect(form.getByRole("button", { name: /send/i })).toBeVisible();
});

test("contact form submits successfully with valid data", async ({ page }) => {
  await page.goto("/");

  const form = page.locator("form");
  await form.scrollIntoViewIfNeeded();

  await form.getByRole("textbox", { name: /from/i }).fill("Test User");
  await form.getByRole("textbox", { name: /reply-to/i }).fill("test@example.com");
  await form.getByRole("textbox", { name: /message/i }).fill("Hello, this is a test message.");

  await form.getByRole("button", { name: /send/i }).click();

  await expect(page.getByText("message stored locally")).toBeVisible({ timeout: 10_000 });
});
