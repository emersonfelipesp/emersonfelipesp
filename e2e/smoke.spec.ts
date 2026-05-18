import { test, expect } from "@playwright/test";

test("homepage loads with correct title and content", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/emersonfelipesp/);
  await expect(page.getByText("Emerson Felipe").first()).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
});

test("/netbox-proxbox loads", async ({ page }) => {
  await page.goto("/netbox-proxbox");
  await expect(page).toHaveURL("/netbox-proxbox");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
});

test("/netbox-sdk loads", async ({ page }) => {
  await page.goto("/netbox-sdk");
  await expect(page).toHaveURL("/netbox-sdk");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
});

test("/proxmox-sdk loads", async ({ page }) => {
  await page.goto("/proxmox-sdk");
  await expect(page).toHaveURL("/proxmox-sdk");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
});

test("/netbox-proxbox/developer loads", async ({ page }) => {
  await page.goto("/netbox-proxbox/developer");
  await expect(page).toHaveURL("/netbox-proxbox/developer");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Project view:/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ci" })).toBeVisible();
  await expect(page.getByText("e2e-docker.yml").first()).toBeVisible();
  await expect(page.getByText("TestPyPI proxbox-api").first()).toBeVisible();
});

test("/proxbox-api/developer loads", async ({ page }) => {
  await page.goto("/proxbox-api/developer");
  await expect(page).toHaveURL("/proxbox-api/developer");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Project view:/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ci" })).toBeVisible();
  await expect(page.getByText("docker-hub-publish.yml").first()).toBeVisible();
  await expect(page.getByText("/api/status/").first()).toBeVisible();
});

test("/netbox-sdk/developer loads", async ({ page }) => {
  await page.goto("/netbox-sdk/developer");
  await expect(page).toHaveURL("/netbox-sdk/developer");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Project view:/ })).toBeVisible();
});

test("/proxmox-sdk/developer loads", async ({ page }) => {
  await page.goto("/proxmox-sdk/developer");
  await expect(page).toHaveURL("/proxmox-sdk/developer");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Project view:/ })).toBeVisible();
});

test("homepage architecture shows three Proxmox nodes with gap-4 spacing", async ({
  page,
}) => {
  await page.goto("/");

  const ceph = page.getByRole("button", { name: "proxmox · ceph" });
  const pbs  = page.getByRole("button", { name: "proxmox · PBS" });
  const pdm  = page.getByRole("button", { name: "proxmox · PDM" });

  await expect(ceph).toBeVisible();
  await expect(pbs).toBeVisible();
  await expect(pdm).toBeVisible();

  const grid = page.locator(".grid.grid-cols-3").filter({ has: ceph });
  await expect(grid).toHaveClass(/gap-8/);
});

test("/netbox-proxbox/roadmap renders diagram and timeline", async ({
  page,
}) => {
  await page.goto("/netbox-proxbox/roadmap");
  await expect(page).toHaveURL("/netbox-proxbox/roadmap");
  await expect(page.locator("main")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Top navigation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Project view:/ }),
  ).toBeVisible();

  const diagramTab = page.locator('[role="tab"][data-view="diagram"]');
  const timelineTab = page.locator('[role="tab"][data-view="timeline"]');
  await expect(diagramTab).toBeVisible();
  await expect(timelineTab).toBeVisible();

  await expect(timelineTab).toHaveAttribute("data-active", "true");
  await expect(
    page.locator("h3").filter({ hasText: /\bphase 1\b/i }).first(),
  ).toBeVisible();

  await diagramTab.click();
  await expect(diagramTab).toHaveAttribute("data-active", "true");
  await expect(
    page.getByRole("img", {
      name: /netbox-proxbox issue dependency graph/,
    }),
  ).toBeVisible();
});
