import { expect, test } from "@playwright/test";

test("netbox-sdk TUI row opens fixture-backed modal hotspots", async ({ page }) => {
  await page.goto("/netbox-sdk");

  const runButton = page.getByRole("button", { name: "run nbx tui" });
  await expect(page.getByText("nbx tui")).toBeVisible();
  await runButton.click();

  const dialog = page.getByRole("dialog", { name: "nbx tui" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-state-id="home"]')).toBeVisible();

  await dialog.getByRole("button", { name: "Open devices" }).click();
  await expect(dialog.locator('[data-state-id="devices"]')).toBeVisible();

  await dialog.getByRole("button", { name: "Show details" }).click();
  await expect(dialog.locator('[data-state-id="details"]')).toBeVisible();

  await dialog.getByRole("button", { name: "Choose filter" }).click();
  await expect(dialog.locator('[data-state-id="filter"]')).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(runButton).toBeFocused();
});

