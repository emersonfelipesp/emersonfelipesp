import { expect, test } from "@playwright/test";

test("project pages expose canonical metadata, Markdown alternates, and JSON-LD", async ({
  page,
}) => {
  await page.goto("/netbox-sdk");

  await expect(
    page.getByRole("heading", { level: 1, name: "netbox-sdk" }),
  ).toBeVisible();

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://emersonfelipesp.com/netbox-sdk",
  );
  const markdownAlternates = await page
    .locator('link[rel="alternate"][type="text/markdown"]')
    .evaluateAll((links) =>
      links.map((link) => link.getAttribute("href") ?? ""),
    );
  expect(markdownAlternates.some((href) => href.endsWith("/md/netbox-sdk"))).toBe(
    true,
  );
  expect(
    markdownAlternates.some((href) =>
      href.endsWith("/netbox-sdk?content=markdown"),
    ),
  ).toBe(true);

  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => script.textContent ?? "").join("\n"),
    );
  expect(jsonLd).toContain("SoftwareSourceCode");
  expect(jsonLd).toContain("BreadcrumbList");
});

test("release detail pages expose article metadata and canonical URLs", async ({
  page,
}) => {
  await page.goto("/netbox-proxbox/releases/v0.0.14");

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://emersonfelipesp.com/netbox-proxbox/releases/v0.0.14",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );

  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => script.textContent ?? "").join("\n"),
    );
  expect(jsonLd).toContain("TechArticle");
  expect(jsonLd).toContain("v0.0.14");
});

test("machine-readable routes advertise canonical and index headers", async ({
  request,
}) => {
  const markdown = await request.get("/md/netbox-sdk");
  expect(markdown.status()).toBe(200);
  expect(markdown.headers()["x-robots-tag"]).toContain("index");
  expect(markdown.headers().link).toContain(
    "https://emersonfelipesp.com/netbox-sdk",
  );
  expect(markdown.headers().link).toContain("rel=\"canonical\"");

  const llms = await request.get("/llms.txt");
  expect(llms.status()).toBe(200);
  expect(llms.headers()["x-robots-tag"]).toContain("max-snippet:-1");
  const body = await llms.text();
  expect(body).toContain("## Crawler directives");
  expect(body).toContain("Markdown: [raw]");
});

test("XML sitemap includes canonical public pages", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain("<loc>https://emersonfelipesp.com/netbox-sdk</loc>");
  expect(body).toContain(
    "<loc>https://emersonfelipesp.com/netbox-proxbox/releases/v0.0.14</loc>",
  );
  expect(body).not.toContain("content=markdown");
});
