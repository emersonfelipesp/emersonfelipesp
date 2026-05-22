import { expect, test, type Locator } from "@playwright/test";

const companionPlugins = [
  ["netbox-ceph", "/netbox-ceph"],
  ["netbox-pbs", "/netbox-pbs"],
  ["netbox-proxbox", "/netbox-proxbox"],
  ["netbox-pdm", "/netbox-pdm"],
  ["netbox-packer", "/netbox-packer"],
] as const;

async function expectPaintedCanvases(
  architecture: Locator,
  minimumCount: number,
) {
  await expect
    .poll(
      async () =>
        architecture.evaluate((root) => {
          const canvases = Array.from(root.querySelectorAll("canvas"));

          return canvases.filter((canvas) => {
            const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
            if (!gl || canvas.width <= 0 || canvas.height <= 0) return false;

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
                return true;
              }
            }

            return false;
          }).length;
        }),
      { timeout: 5000 },
    )
    .toBeGreaterThanOrEqual(minimumCount);
}

test("/proxbox-api integration map includes companion NetBox plugins", async ({
  page,
}) => {
  await page.goto("/proxbox-api");

  const architecture = page.getByTestId("proxbox-api-integrations-architecture");
  const pluginRow = page.getByTestId("proxbox-api-plugin-row");

  await expect(architecture).toBeVisible();
  await expect(pluginRow).toBeVisible();

  for (const [name, href] of companionPlugins) {
    await expect(pluginRow.getByRole("link", { name })).toHaveAttribute(
      "href",
      href,
    );
  }

  await expect(
    architecture.getByRole("button", { name: "proxbox-api" }),
  ).toBeVisible();
  await expect(
    architecture.getByRole("link", { name: "netbox-sdk" }),
  ).toBeVisible();
  await expect(
    architecture.getByRole("link", { name: "proxmox-sdk" }),
  ).toBeVisible();
  await expect(
    architecture.getByTestId("proxbox-api-connector-plugin-funnel"),
  ).toBeVisible();

  await expectPaintedCanvases(architecture, 3);

  await pluginRow.getByRole("link", { name: "netbox-packer" }).focus();
  await expect(architecture.locator("#integ-tip-netbox-packer")).toHaveCSS(
    "opacity",
    "1",
  );
});

test("/proxbox-api integration map has pt-br companion plugin copy", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("lang", "pt-br");
  });
  await page.goto("/proxbox-api");

  const architecture = page.getByTestId("proxbox-api-integrations-architecture");
  const pluginRow = page.getByTestId("proxbox-api-plugin-row");

  await pluginRow.getByRole("link", { name: "netbox-pdm" }).focus();
  await expect(architecture.locator("#integ-tip-netbox-pdm")).toContainText(
    "Plugin do NetBox para Proxmox Datacenter Manager",
  );
});
