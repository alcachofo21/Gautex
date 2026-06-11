import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Formato no permitido (PNG, JPG, PDF)" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Archivo demasiado grande (máx. 5 MB)" }, { status: 400 });
    }

    const ext = path.extname(file.name) || (file.type === "application/pdf" ? ".pdf" : ".png");
    const safeName = `${randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "campaigns");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, safeName), buffer);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    const url = `${siteUrl}/uploads/campaigns/${safeName}`;

    return NextResponse.json({
      success: true,
      fileName: file.name,
      url,
      path: `/uploads/campaigns/${safeName}`,
    });
  } catch (e) {
    console.error("[GAUTEX UPLOAD]", e);
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
  }
}
