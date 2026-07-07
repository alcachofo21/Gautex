import { describe, it, expect, beforeEach, vi } from "vitest";
import { uploadFile } from "@/lib/storage";
import { PNG_BYTES } from "@/test-helpers/fixtures";

vi.mock("fs/promises", () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

describe("storage", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    process.env.NODE_ENV = "test";
  });

  it("uploads via Cloudinary when configured", async () => {
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "test-cloud");
    vi.stubEnv("CLOUDINARY_UPLOAD_PRESET", "test-preset");
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ secure_url: "https://res.cloudinary.com/img.png", public_id: "gautex/test" }),
        { status: 200 }
      )
    );

    const file = new File([PNG_BYTES], "logo.png", { type: "image/png" });
    const result = await uploadFile(file, "campaigns");
    expect(result.url).toContain("cloudinary.com");
  });

  it("uploads locally in development", async () => {
    delete process.env.CLOUDINARY_CLOUD_NAME;
    delete process.env.CLOUDINARY_UPLOAD_PRESET;
    process.env.NODE_ENV = "development";
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");

    const file = new File([PNG_BYTES], "logo.png", { type: "image/png" });
    const result = await uploadFile(file, "campaigns");
    expect(result.path).toContain("/uploads/campaigns/");
    expect(result.fileName).toBe("logo.png");
  });

  it("rejects local upload in production without Cloudinary", async () => {
    delete process.env.CLOUDINARY_CLOUD_NAME;
    delete process.env.CLOUDINARY_UPLOAD_PRESET;
    process.env.NODE_ENV = "production";

    const file = new File([PNG_BYTES], "logo.png", { type: "image/png" });
    await expect(uploadFile(file)).rejects.toThrow(/Cloudinary/);
  });

  it("throws when Cloudinary upload fails", async () => {
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "test-cloud");
    vi.stubEnv("CLOUDINARY_UPLOAD_PRESET", "test-preset");
    globalThis.fetch = vi.fn().mockResolvedValue(new Response("fail", { status: 500 }));

    const file = new File([PNG_BYTES], "logo.png", { type: "image/png" });
    await expect(uploadFile(file)).rejects.toThrow(/Cloudinary/);
  });
});
