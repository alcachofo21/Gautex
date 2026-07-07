import { test, expect } from "@playwright/test";

test("contact form submits successfully", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  await page.goto("/contacto");
  await page.getByLabel(/Nombre/i).fill("Juan");
  await page.getByLabel(/Apellidos/i).fill("García");
  await page.getByLabel(/Email/i).fill("juan@test.com");
  await page.getByLabel(/Mensaje/i).fill("Consulta de prueba E2E");
  await page.getByRole("button", { name: /Enviar mensaje/i }).click();
  await expect(page.getByText(/Mensaje enviado/i)).toBeVisible();
});
