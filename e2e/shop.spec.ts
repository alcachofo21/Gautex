import { test, expect } from "@playwright/test";

test("add product to cart from shop", async ({ page }) => {
  await page.goto("/productos");
  const addButton = page.getByRole("button", { name: /Añadir al carrito/i }).first();
  await addButton.click();
  await page.goto("/carrito");
  await expect(page.getByText(/Matrix|Preservativos|productos/i).first()).toBeVisible();
});
