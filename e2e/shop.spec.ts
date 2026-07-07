import { test, expect } from "@playwright/test";

test("add product to cart from shop", async ({ page }) => {
  await page.goto("/productos");
  const addButton = page.getByRole("button", { name: /Añadir/i }).first();
  await addButton.click();
  await page.goto("/carrito");
  await expect(page.getByText(/vacío/i)).not.toBeVisible();
  await expect(page.getByRole("link").first()).toBeVisible();
});
