import { test, expect } from "@playwright/test";
import { languageTrigger, languageTriggerPt, themeTrigger } from "./_nav";

test("page loads in english by default", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(languageTrigger(page)).toContainText("en");
});

test("language toggle switches to pt-br and renders accents", async ({
  page,
}) => {
  await page.goto("/");

  await languageTrigger(page).click();

  await page.getByRole("option", { name: "pt-br" }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  // PT-BR accent characters render correctly (UTF-8 round-trip).
  await expect(page.getByText(/Automação de Redes/i).first()).toBeVisible();
});

test("language selection persists across reloads", async ({ page }) => {
  await page.goto("/");
  await languageTrigger(page).click();
  await page.getByRole("option", { name: "pt-br" }).click();

  await page.reload();
  await page.evaluate(() => window.scrollTo(0, 0));

  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(languageTriggerPt(page)).toContainText("pt-br");
});

test("project pages render in pt-br when language is pt-br", async ({
  page,
}) => {
  await page.goto("/");
  await languageTrigger(page).click();
  await page.getByRole("option", { name: "pt-br" }).click();

  await page.goto("/netbox-proxbox");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByText(/sincroniza/i).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /visão geral/i })).toBeVisible();

  await page.goto("/proxmox-sdk");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByText(/orientado a schema/i).first()).toBeVisible();

  await page.goto("/netbox-sdk");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByText(/Toolkit moderno/i).first()).toBeVisible();
});

test("theme and language are independent", async ({ page }) => {
  await page.goto("/");
  await languageTrigger(page).click();
  await page.getByRole("option", { name: "pt-br" }).click();

  await themeTrigger(page).click();
  await page.getByRole("option", { name: "default-light" }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});
