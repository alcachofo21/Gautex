import { describe, it, expect } from "vitest";
import { readApiErrorMessage } from "@/lib/form-api";

describe("readApiErrorMessage", () => {
  it("returns server error message when present", async () => {
    const response = new Response(JSON.stringify({ error: "Datos inválidos" }), {
      status: 400,
    });
    await expect(readApiErrorMessage(response, "Error genérico")).resolves.toBe("Datos inválidos");
  });

  it("returns fallback when error field is missing", async () => {
    const response = new Response(JSON.stringify({ success: false }), { status: 400 });
    await expect(readApiErrorMessage(response, "Error genérico")).resolves.toBe("Error genérico");
  });

  it("returns fallback when response body is not JSON", async () => {
    const response = new Response("not-json", { status: 500 });
    await expect(readApiErrorMessage(response, "Error genérico")).resolves.toBe("Error genérico");
  });
});
