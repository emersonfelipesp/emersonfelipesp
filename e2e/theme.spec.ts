import { test, expect } from "@playwright/test";

test("page loads with dark theme by default", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);
});

test("theme toggle switches between light and dark", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);

  // Open the theme dropdown (full nav, not compact — page starts at top)
  const toggleBtn = page.getByRole("button", { name: /--theme=/ });
  await toggleBtn.click();

  // Select default-light from the listbox
  const lightOption = page.getByRole("option", { name: "default-light" });
  await lightOption.click();

  await expect(html).not.toHaveClass(/dark/);
});

test("theme selection persists across page reloads", async ({ page }) => {
  await page.goto("/");

  const toggleBtn = page.getByRole("button", { name: /--theme=/ });
  await toggleBtn.click();
  await page.getByRole("option", { name: "default-light" }).click();

  await page.reload();

  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);
});
