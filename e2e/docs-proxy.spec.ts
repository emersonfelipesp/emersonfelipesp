import { expect, test } from "@playwright/test";

const LIVE_DOCS_PROJECTS = [
  {
    slug: "netbox-proxbox",
    title: /Proxbox Docs/,
    searchText: "Proxbox",
  },
  {
    slug: "proxbox-api",
    title: /proxbox-api/,
    searchText: "proxbox-api Documentation",
  },
  {
    slug: "netbox-sdk",
    title: /NetBox SDK/,
    searchText: "NetBox SDK",
  },
  {
    slug: "proxmox-sdk",
    title: /Proxmox OpenAPI/,
    searchText: "Proxmox OpenAPI",
  },
] as const;

const UNPUBLISHED_DOCS_PROJECTS = [
  "netbox-ceph",
  "netbox-pdm",
  "netbox-pbs",
  "netbox-packer",
] as const;

for (const project of LIVE_DOCS_PROJECTS) {
  test(`${project.slug} docs root renders from the first-party path`, async ({
    page,
    request,
  }) => {
    const redirect = await request.get(`/${project.slug}/docs`, {
      maxRedirects: 0,
    });
    expect(redirect.status()).toBe(308);
    expect(redirect.headers().location).toMatch(
      new RegExp(`/${project.slug}/docs/$`),
    );

    const response = await request.get(`/${project.slug}/docs/`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(`https://emersonfelipesp.com/${project.slug}/docs/`);
    expect(html).toContain(`/${project.slug}/docs/`);
    expect(html).not.toContain(`https://emersonfelipesp.github.io/${project.slug}`);
    expect(html).not.toContain('content="noindex"');

    await page.goto(`/${project.slug}/docs/`);
    await expect(page).toHaveTitle(project.title);
  });

  test(`${project.slug} docs search index is proxied`, async ({ request }) => {
    const searchIndex = await request.get(
      `/${project.slug}/docs/search/search_index.json`,
    );
    expect(searchIndex.status()).toBe(200);
    expect(searchIndex.headers()["content-type"]).toContain("application/json");
    expect(await searchIndex.text()).toContain(project.searchText);
  });
}

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

test("unpublished docs projects proxy upstream 404s", async ({ request }) => {
  for (const slug of UNPUBLISHED_DOCS_PROJECTS) {
    const redirect = await request.get(`/${slug}/docs`, {
      maxRedirects: 0,
    });
    expect(redirect.status(), slug).toBe(308);
    expect(redirect.headers().location, slug).toMatch(
      new RegExp(`/${slug}/docs/$`),
    );

    const response = await request.get(`/${slug}/docs/`);
    expect(response.status(), slug).toBe(404);
  }
});

test("non-doc routes keep no-trailing-slash behavior", async ({ request }) => {
  const response = await request.get("/netbox-sdk/", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toMatch(/\/netbox-sdk$/);
});
