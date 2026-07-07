import { describe, it, expect } from "vitest";
import { isBlockedExtension, validateUploadBuffer } from "@/lib/upload-validation";
import { PNG_BYTES, PDF_BYTES, GIF_BYTES } from "@/test-helpers/fixtures";

describe("upload-validation", () => {
  it("blocks dangerous extensions", () => {
    expect(isBlockedExtension("malware.exe")).toBe(true);
    expect(isBlockedExtension("image.png")).toBe(false);
    expect(isBlockedExtension("noextension")).toBe(false);
  });

  it("validates PNG magic bytes", async () => {
    const result = await validateUploadBuffer(PNG_BYTES, "test.png", "image/png");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.mime).toBe("image/png");
  });

  it("rejects image/jpg when bytes are not JPEG", async () => {
    const result = await validateUploadBuffer(PNG_BYTES, "test.jpg", "image/jpg");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("no coincide");
  });

  it("rejects declared jpeg when bytes are png", async () => {
    const result = await validateUploadBuffer(PNG_BYTES, "test.png", "image/jpeg");
    expect(result.ok).toBe(false);
  });

  it("validates PDF magic bytes", async () => {
    const result = await validateUploadBuffer(PDF_BYTES, "doc.pdf", "application/pdf");
    expect(result.ok).toBe(true);
  });

  it("rejects undeclared MIME type", async () => {
    const result = await validateUploadBuffer(PNG_BYTES, "test.png", "image/gif");
    expect(result.ok).toBe(false);
  });

  it("rejects mismatched MIME", async () => {
    const result = await validateUploadBuffer(PNG_BYTES, "test.png", "application/pdf");
    expect(result.ok).toBe(false);
  });

  it("rejects blocked extension even with valid bytes", async () => {
    const result = await validateUploadBuffer(PNG_BYTES, "test.exe", "image/png");
    expect(result.ok).toBe(false);
  });

  it("rejects undetectable buffer", async () => {
    const result = await validateUploadBuffer(Buffer.from("hello"), "test.png", "image/png");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("verificar");
  });

  it("rejects detected but disallowed type", async () => {
    const result = await validateUploadBuffer(GIF_BYTES, "test.gif", "image/png");
    expect(result.ok).toBe(false);
  });
});
