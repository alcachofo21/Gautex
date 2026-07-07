import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export type UploadResult = {
  url: string;
  path: string;
  fileName: string;
};

export async function uploadFile(
  file: File,
  folder = "campaigns"
): Promise<UploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (process.env.NODE_ENV === "production" && (!cloudName || !uploadPreset)) {
    throw new Error(
      "Cloudinary es obligatorio en producción. Configure CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET."
    );
  }

  if (cloudName && uploadPreset) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);
    fd.append("folder", `gautex/${folder}`);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const data = (await res.json()) as { secure_url: string; public_id: string };
    return {
      url: data.secure_url,
      path: data.public_id,
      fileName: file.name,
    };
  }

  const ext = path.extname(file.name) || ".bin";
  const safeName = `${randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, safeName), buffer);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const publicPath = `/uploads/${folder}/${safeName}`;

  return {
    url: siteUrl ? `${siteUrl}${publicPath}` : publicPath,
    path: publicPath,
    fileName: file.name,
  };
}
