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

  await Promise.all(cases.map(async (item) => {
    const res = await request.get(item.path, { headers: markdownHeaders });
    expect(res.status(), item.path).toBe(200);
    expect(res.headers()["content-type"], item.path).toContain(
      "text/markdown",
    );
    const body = await res.text();
    for (const expected of item.expected) {
      expect(body, item.path).toContain(expected);
    }
  }));
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
  const paths = [
    "/llms.txt",
    "/llms-full.txt",
    "/sitemap.md",
    "/sitemap.txt",
  ];

  await Promise.all(paths.map(async (path) => {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"], path).toContain("text/markdown");
    const body = await res.text();
    expect(body, path).toContain("emersonfelipesp.com");
  }));
});

test("llms.txt and sitemap index release detail pages", async ({ request }) => {
  await Promise.all(["/llms.txt", "/sitemap.md"].map(async (path) => {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const body = await res.text();
    expect(body, path).toContain("## Release detail pages");
    expect(body, path).toContain("/netbox-proxbox/releases/v0.0.14");
  }));
});

test("footer toggles between human, themed Markdown, and raw Markdown views", async ({
  page,
}) => {
  await page.goto("/netbox-sdk?utm=docs");

  const footer = page.getByRole("contentinfo");
  const markdownView = footer.getByRole("link", {
    name: "Switch to markdown view",
  });
  const rawView = footer.getByRole("link", {
    name: "Switch to raw view",
  });

  await expect(markdownView).toHaveAttribute(
    "href",
    "/netbox-sdk?utm=docs&content=markdown",
  );
  await expect(rawView).toHaveAttribute("href", "/md/netbox-sdk");

  await markdownView.click();
  await expect(page).toHaveURL(/\/netbox-sdk\?utm=docs&content=markdown$/);
  await expect(
    page.getByRole("navigation", { name: "Top navigation" }),
  ).toBeVisible();
  await expect(page.getByTestId("themed-markdown")).toContainText(
    "# netbox-sdk",
  );
  await expect(page.getByTestId("themed-markdown")).toContainText(
    "## Features",
  );

  const humanView = footer.getByRole("link", {
    name: "Switch to human view",
  });
  await expect(humanView).toHaveAttribute("href", "/netbox-sdk?utm=docs");

  await humanView.click();
  await expect(page).toHaveURL(/\/netbox-sdk\?utm=docs$/);
  await expect(page.getByTestId("themed-markdown")).toHaveCount(0);

  await footer.getByRole("link", { name: "Switch to raw view" }).click();
  await expect(page).toHaveURL(/\/md\/netbox-sdk$/);
  await expect(page.locator("body")).toContainText("# netbox-sdk");
  await expect(page.locator("body")).toContainText("## Features");
});

test("release detail pages support themed Markdown query mode", async ({
  page,
}) => {
  await page.goto("/netbox-proxbox/releases/v0.0.14?content=markdown");

  await expect(
    page.getByRole("navigation", { name: "Top navigation" }),
  ).toBeVisible();
  await expect(page.getByTestId("themed-markdown")).toContainText(
    "# netbox-proxbox v0.0.14",
  );
  await expect(page.getByTestId("themed-markdown")).toContainText(
    "## Release notes",
  );
  await expect(
    page.getByRole("contentinfo").getByRole("link", {
      name: "Switch to raw view",
    }),
  ).toHaveAttribute("href", "/md/netbox-proxbox/releases/v0.0.14");
});
