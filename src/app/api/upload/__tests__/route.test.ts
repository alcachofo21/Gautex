import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/upload/route";
import { createApiRequest } from "@/test-helpers/api";
import { resetRateLimitBuckets } from "@/lib/rate-limit";
import { PNG_BYTES } from "@/test-helpers/fixtures";

import { uploadFile } from "@/lib/storage";

vi.mock("@/lib/storage", () => ({
  uploadFile: vi.fn().mockResolvedValue({
    url: "https://example.com/file.png",
    path: "/uploads/campaigns/file.png",
    fileName: "file.png",
  }),
}));

describe("POST /api/upload", () => {
  beforeEach(() => {
    resetRateLimitBuckets();
  });

  function makeUploadRequest(file?: File) {
    const formData = new FormData();
    if (file) formData.append("file", file);
    return createApiRequest("/api/upload", { method: "POST", body: formData });
  }

  it("uploads valid PNG", async () => {
    const file = new File([PNG_BYTES], "logo.png", { type: "image/png" });
    const res = await POST(makeUploadRequest(file));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 400 without file", async () => {
    const res = await POST(makeUploadRequest());
    expect(res.status).toBe(400);
  });

  it("returns 400 for oversized file", async () => {
    const big = new Uint8Array(6 * 1024 * 1024);
    const file = new File([big], "big.png", { type: "image/png" });
    const res = await POST(makeUploadRequest(file));
    expect(res.status).toBe(400);
  });

  it("returns 400 for blocked extension", async () => {
    const file = new File([PNG_BYTES], "malware.exe", { type: "image/png" });
    const res = await POST(makeUploadRequest(file));
    expect(res.status).toBe(400);
  });

  it("returns 403 for wrong origin", async () => {
    const file = new File([PNG_BYTES], "logo.png", { type: "image/png" });
    const formData = new FormData();
    formData.append("file", file);
    const res = await POST(
      new Request("http://localhost:3000/api/upload", {
        method: "POST",
        headers: { origin: "https://evil.com" },
        body: formData,
      })
    );
    expect(res.status).toBe(403);
  });

  it("returns 429 when rate limited", async () => {
    const file = new File([PNG_BYTES], "logo.png", { type: "image/png" });
    for (let i = 0; i < 6; i++) {
      await POST(makeUploadRequest(file));
    }
    const res = await POST(makeUploadRequest(file));
    expect(res.status).toBe(429);
  });

  it("returns 500 when storage fails", async () => {
    vi.mocked(uploadFile).mockRejectedValueOnce(new Error("storage down"));
    const file = new File([PNG_BYTES], "logo.png", { type: "image/png" });
    const res = await POST(makeUploadRequest(file));
    expect(res.status).toBe(500);
  });
});
