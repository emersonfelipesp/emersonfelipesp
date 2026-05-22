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
  await expect(page.getByRole("link", { name: "View documentation" })).toHaveAttribute(
    "href",
    "https://emersonfelipesp.com/netbox-proxbox/docs/",
  );
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
  await expect(grid).toHaveClass(/gap-4/);
});

test("homepage architecture renders centered Three.js connectors", async ({
  page,
}) => {
  await page.goto("/");

  const architecture = page.getByTestId("projects-architecture");
  await expect(architecture).toBeVisible();
  await expect(
    page.locator('[data-testid^="projects-architecture-connector-"]'),
  ).toHaveCount(5);

  const metrics = await architecture.evaluate((root) => {
    const scroller = root as HTMLElement;
    const scrollerRect = scroller.getBoundingClientRect();
    const netbox = scroller.querySelector<HTMLElement>('[aria-label="netbox"]');
    const netboxRect = netbox?.getBoundingClientRect();
    const canvases = Array.from(scroller.querySelectorAll("canvas")).map(
      (canvas) => {
        const rect = canvas.getBoundingClientRect();
        return {
          bufferHeight: canvas.height,
          bufferWidth: canvas.width,
          height: Math.round(rect.height),
          width: Math.round(rect.width),
        };
      },
    );

    return {
      canvasCount: canvases.length,
      canvases,
      clientWidth: scroller.clientWidth,
      netboxVisible:
        !!netboxRect &&
        netboxRect.left >= scrollerRect.left &&
        netboxRect.right <= scrollerRect.right,
      scrollLeft: Math.round(scroller.scrollLeft),
      scrollWidth: scroller.scrollWidth,
    };
  });

  expect(metrics.canvasCount).toBe(5);
  expect(metrics.netboxVisible).toBe(true);
  for (const canvas of metrics.canvases) {
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
    expect(canvas.bufferWidth).toBeGreaterThan(0);
    expect(canvas.bufferHeight).toBeGreaterThan(0);
  }
  if (metrics.scrollWidth > metrics.clientWidth) {
    expect(metrics.scrollLeft).toBeGreaterThan(0);
  }

  await architecture.getByRole("link", { name: "netbox-proxbox" }).focus();
  await expect(page.locator("#tip-netbox-proxbox")).toHaveCSS("opacity", "1");
});

test("/posts loads and lists all posts", async ({ page }) => {
  await page.goto("/posts");
  await expect(page).toHaveURL("/posts");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Proxmox VE 9.2 support in proxmox-sdk" })).toBeVisible();
  await expect(page.getByRole("link", { name: "proxmoxer vs proxmox-sdk" })).toBeVisible();
  await expect(page.getByRole("link", { name: "pynetbox vs netbox-sdk" })).toBeVisible();
});

test("/proxmox-sdk/proxmox-v9.2-support loads", async ({ page }) => {
  await page.goto("/proxmox-sdk/proxmox-v9.2-support");
  await expect(page).toHaveURL("/proxmox-sdk/proxmox-v9.2-support");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What changed in the API surface" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cluster-wide custom CPU models" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "SDN prefix lists for BGP policy" })).toBeVisible();
});

test("/proxmox-sdk/proxmoxer-comparison loads", async ({ page }) => {
  await page.goto("/proxmox-sdk/proxmoxer-comparison");
  const main = page.locator("main");
  await expect(page).toHaveURL("/proxmox-sdk/proxmoxer-comparison");
  await expect(main).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "libraries" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "comparison" })).toBeVisible();
  await expect(main.getByText("proxmoxer").first()).toBeVisible();
  await expect(main.getByText("proxmox-sdk").first()).toBeVisible();
});

test("/netbox-sdk/pynetbox-comparison loads", async ({ page }) => {
  await page.goto("/netbox-sdk/pynetbox-comparison");
  const main = page.locator("main");
  await expect(page).toHaveURL("/netbox-sdk/pynetbox-comparison");
  await expect(main).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Top navigation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "libraries" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "comparison" })).toBeVisible();
  await expect(main.getByText("pynetbox").first()).toBeVisible();
  await expect(main.getByText("netbox-sdk").first()).toBeVisible();
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
