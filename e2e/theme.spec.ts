import { test, expect } from "@playwright/test";
import { themeTrigger } from "./_nav";

test("page loads with dark theme by default", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);
});

test("theme toggle switches between light and dark", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);

  await themeTrigger(page).click();

  const lightOption = page.getByRole("option", { name: "default-light" });
  await lightOption.click();

  await expect(html).not.toHaveClass(/dark/);
});

test("theme selection persists across page reloads", async ({ page }) => {
  await page.goto("/");

  await themeTrigger(page).click();
  await page.getByRole("option", { name: "default-light" }).click();

  await page.reload();

  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);
});
