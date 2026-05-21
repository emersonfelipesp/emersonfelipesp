import { expect, test } from "@playwright/test";

const expectedNodes = [
  "netbox",
  "netbox-ceph",
  "netbox-pbs",
  "netbox-proxbox",
  "netbox-pdm",
  "netbox-packer",
  "proxbox-api",
  "netbox-sdk",
  "netbox · REST API",
  "proxmox-sdk",
  "Proxmox VE",
  "proxmox · ceph",
  "proxmox · PBS",
  "proxmox · PDM",
];

function exactName(label: string): RegExp {
  return new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
}

test("standalone architecture diagram page renders the homepage diagram", async ({
  page,
}) => {
  await page.goto("/architecture-diagram");
  await expect(page).toHaveTitle(/Architecture Diagram/);
  await expect(page.locator("main")).toHaveAttribute(
    "aria-label",
    "Architecture diagram",
  );
  await expect(page.getByTestId("architecture-diagram-standalone")).toBeVisible();

  for (const node of expectedNodes) {
    const locator =
      node === "netbox-proxbox" || node === "netbox-sdk" || node === "proxmox-sdk"
        ? page.getByRole("link", { name: exactName(node) })
        : page.getByRole("button", { name: exactName(node) });
    await expect(locator).toBeVisible();
  }

  await expect(
    page.locator('[data-testid^="architecture-diagram-connector-"]'),
  ).toHaveCount(5);

  await page.getByRole("link", { name: exactName("netbox-proxbox") }).focus();
  await expect(page.locator("#architecture-tip-netbox-proxbox")).toHaveCSS(
    "opacity",
    "1",
  );
});

test("standalone architecture diagram page is self-contained HTML", async ({
  page,
}) => {
  await page.goto("/architecture-diagram");

  await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
  await expect(page.locator("script")).toHaveCount(0);

  const styleText = await page.locator("style").first().textContent();
  expect(styleText).toContain("--accent: #00f2d4");
  expect(styleText).toContain(".node-control");
});

test("architecture diagram SVG is self-contained and GitHub embeddable", async ({
  request,
}) => {
  const response = await request.get("/architecture-diagram.svg");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/svg+xml");

  const body = await response.text();
  expect(body).toContain("<style>");
  expect(body).toContain("netbox-proxbox");
  expect(body).toContain("proxmox · PDM");
  expect(body).not.toContain("<script");
  expect(body).not.toContain("<link");
  expect(body).not.toContain("<image");
  expect(body).not.toContain("stylesheet");
});
