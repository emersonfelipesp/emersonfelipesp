import { expect, test } from "@playwright/test";

test("netbox-proxbox docs root renders from the first-party path", async ({
  page,
  request,
}) => {
  const redirect = await request.get("/netbox-proxbox/docs", {
    maxRedirects: 0,
  });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toMatch(/\/netbox-proxbox\/docs\/$/);

  const response = await request.get("/netbox-proxbox/docs/");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("Proxbox Docs");
  expect(html).toContain("https://emersonfelipesp.com/netbox-proxbox/docs/");
  expect(html).not.toContain('content="noindex"');

  await page.goto("/netbox-proxbox/docs/");
  await expect(page).toHaveTitle(/Proxbox Docs/);
  await expect(page.getByRole("heading", { name: "Proxbox" })).toBeVisible();
});

test("netbox-proxbox docs nested pages and assets are proxied", async ({
  page,
  request,
}) => {
  const nestedRedirect = await request.get("/netbox-proxbox/docs/installation", {
    maxRedirects: 0,
  });
  expect(nestedRedirect.status()).toBe(308);
  expect(nestedRedirect.headers().location).toMatch(
    /\/netbox-proxbox\/docs\/installation\/$/,
  );

  await page.goto("/netbox-proxbox/docs/installation/");
  await expect(page).toHaveTitle(/Overview - Proxbox Docs/);
  await expect(
    page.getByRole("heading", { name: "Installation" }).first(),
  ).toBeVisible();

  const searchIndex = await request.get(
    "/netbox-proxbox/docs/search/search_index.json",
  );
  expect(searchIndex.status()).toBe(200);
  expect(searchIndex.headers()["content-type"]).toContain("application/json");
  expect(await searchIndex.text()).toContain("Proxbox");
});

test("non-doc routes keep no-trailing-slash behavior", async ({ request }) => {
  const response = await request.get("/netbox-sdk/", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toMatch(/\/netbox-sdk$/);
});
