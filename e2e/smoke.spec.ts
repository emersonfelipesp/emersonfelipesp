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

test("/proxbox-api integration map renders five plugin row with Three.js connectors", async ({
  page,
}) => {
  await page.goto("/proxbox-api");

  const architecture = page.getByTestId("proxbox-api-integrations-architecture");
  const pluginRow = page.getByTestId("proxbox-api-plugin-row");

  await expect(architecture).toBeVisible();
  await expect(pluginRow).toBeVisible();

  const pluginLinks = [
    ["netbox-ceph", "/netbox-ceph"],
    ["netbox-pbs", "/netbox-pbs"],
    ["netbox-proxbox", "/netbox-proxbox"],
    ["netbox-pdm", "/netbox-pdm"],
    ["netbox-packer", "/netbox-packer"],
  ] as const;

  for (const [name, href] of pluginLinks) {
    await expect(pluginRow.getByRole("link", { name })).toHaveAttribute(
      "href",
      href,
    );
  }

  await expect(
    architecture.getByRole("button", { name: "proxbox-api" }),
  ).toBeVisible();

  const metrics = await architecture.evaluate((root) => {
    const canvases = Array.from(root.querySelectorAll("canvas")).map(
      (canvas) => {
        const rect = canvas.getBoundingClientRect();
        const gl =
          canvas.getContext("webgl2") ?? canvas.getContext("webgl");
        let painted = false;

        if (gl && canvas.width > 0 && canvas.height > 0) {
          const pixels = new Uint8Array(canvas.width * canvas.height * 4);
          gl.readPixels(
            0,
            0,
            canvas.width,
            canvas.height,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            pixels,
          );

          for (let i = 0; i < pixels.length; i += 4) {
            if (
              pixels[i] > 0 ||
              pixels[i + 1] > 0 ||
              pixels[i + 2] > 0 ||
              pixels[i + 3] > 0
            ) {
              painted = true;
              break;
            }
          }
        }

        return {
          bufferHeight: canvas.height,
          bufferWidth: canvas.width,
          height: Math.round(rect.height),
          painted,
          width: Math.round(rect.width),
        };
      },
    );

    return {
      canvasCount: canvases.length,
      canvases,
      paintedCanvasCount: canvases.filter((canvas) => canvas.painted).length,
    };
  });

  expect(metrics.canvasCount).toBeGreaterThanOrEqual(5);
  expect(metrics.paintedCanvasCount).toBeGreaterThanOrEqual(5);
  for (const canvas of metrics.canvases) {
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
    expect(canvas.bufferWidth).toBeGreaterThan(0);
    expect(canvas.bufferHeight).toBeGreaterThan(0);
  }

  await pluginRow.getByRole("link", { name: "netbox-packer" }).focus();
  await expect(architecture.locator("#integ-tip-netbox-packer")).toHaveCSS(
    "opacity",
    "1",
  );
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
  await expect(grid).toHaveClass(/gap-4/);
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
