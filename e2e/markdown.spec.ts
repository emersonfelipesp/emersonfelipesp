import { expect, test } from "@playwright/test";

const markdownHeaders = {
  accept: "text/markdown, text/html;q=0.8",
};

test("homepage serves Markdown through content negotiation", async ({
  request,
}) => {
  const res = await request.get("/", { headers: markdownHeaders });
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/markdown");
  expect(res.headers()["vary"]).toContain("Accept");

  const body = await res.text();
  expect(body).toContain("# Emerson Felipe");
  expect(body).toContain("## Featured projects");
  expect(body).toContain("## Skills");
});

test("project, developer, roadmap, and release pages serve Markdown", async ({
  request,
}) => {
  const cases = [
    {
      path: "/netbox-sdk",
      expected: ["# netbox-sdk", "## Features", "pip install"],
    },
    {
      path: "/netbox-proxbox/developer",
      expected: ["# netbox-proxbox developer guide", "## CI", "e2e-docker.yml"],
    },
    {
      path: "/netbox-proxbox/roadmap",
      expected: ["# netbox-proxbox roadmap", "## Timeline", "## Issues"],
    },
    {
      path: "/netbox-proxbox/releases",
      expected: ["# netbox-proxbox releases", "Release index", "v0.0.14"],
    },
    {
      path: "/netbox-proxbox/releases/v0.0.14",
      expected: ["# netbox-proxbox v0.0.14", "## Release notes"],
    },
  ];

  for (const item of cases) {
    const res = await request.get(item.path, { headers: markdownHeaders });
    expect(res.status(), item.path).toBe(200);
    expect(res.headers()["content-type"], item.path).toContain(
      "text/markdown",
    );
    const body = await res.text();
    for (const expected of item.expected) {
      expect(body, item.path).toContain(expected);
    }
  }
});

test("HTML and API requests are not rewritten to Markdown", async ({
  request,
}) => {
  const html = await request.get("/netbox-sdk", {
    headers: { accept: "text/html" },
  });
  expect(html.status()).toBe(200);
  expect(html.headers()["content-type"]).toContain("text/html");

  const api = await request.get("/api/views", {
    headers: markdownHeaders,
    params: { path: "/" },
  });
  expect(api.status()).toBe(200);
  expect(api.headers()["content-type"]).toContain("application/json");
  await expect(api.json()).resolves.toEqual({
    path: "/",
    count: expect.any(Number),
  });
});

test("LLM discovery routes serve Markdown", async ({ request }) => {
  for (const path of [
    "/llms.txt",
    "/llms-full.txt",
    "/sitemap.md",
    "/sitemap.txt",
  ]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"], path).toContain("text/markdown");
    const body = await res.text();
    expect(body, path).toContain("emersonfelipesp.com");
  }
});

test("llms.txt and sitemap index release detail pages", async ({ request }) => {
  for (const path of ["/llms.txt", "/sitemap.md"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const body = await res.text();
    expect(body, path).toContain("## Release detail pages");
    expect(body, path).toContain("/netbox-proxbox/releases/v0.0.14");
  }
});

test("footer toggles the current page into LLM Markdown view", async ({
  page,
}) => {
  await page.goto("/netbox-sdk");

  const topNav = page.getByRole("navigation", { name: "Top navigation" });
  await expect(
    topNav.getByRole("link", { name: "Switch to LLM view" }),
  ).toHaveCount(0);

  const llmView = page.getByRole("contentinfo").getByRole("link", {
    name: "Switch to LLM view",
  });
  await expect(llmView).toHaveAttribute("href", "/md/netbox-sdk");

  await llmView.click();
  await expect(page).toHaveURL(/\/md\/netbox-sdk$/);
  await expect(page.locator("body")).toContainText("# netbox-sdk");
  await expect(page.locator("body")).toContainText("## Features");
});
