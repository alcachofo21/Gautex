import { test, expect } from "@playwright/test";

test("checkout API returns methods", async ({ request }) => {
  const response = await request.get("/api/checkout?locale=es");
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data).toHaveProperty("methods");
  expect(data).toHaveProperty("instantCheckoutEnabled");
  expect(data).toHaveProperty("pricing");
});
