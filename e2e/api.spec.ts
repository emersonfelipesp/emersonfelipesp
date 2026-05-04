import { test, expect } from "@playwright/test";

test("contact API persists a valid message", async ({ request }) => {
  const res = await request.post("/api/contact", {
    data: {
      name: "Test User",
      email: "test@example.com",
      message: "Hello, this is a test message.",
    },
  });

  expect(res.status()).toBe(201);
  const body = (await res.json()) as { ok: boolean; id: string };
  expect(body.ok).toBe(true);
  expect(body.id).toBeTruthy();
  expect(body.id).not.toBe("noop");
});

test("views API reads and increments validated paths", async ({ request }) => {
  const path = `/e2e-api-${Date.now()}`;

  const before = await request.get("/api/views", { params: { path } });
  expect(before.status()).toBe(200);
  await expect(before.json()).resolves.toEqual({ path, count: 0 });

  const incremented = await request.post("/api/views", { data: { path } });
  expect(incremented.status()).toBe(200);
  await expect(incremented.json()).resolves.toEqual({ path, count: 1 });
});
