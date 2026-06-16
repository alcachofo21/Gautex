import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`upload:${ip}`, 5);
    if (!limited.ok) {
      return NextResponse.json({ error: "Demasiadas subidas" }, { status: 429 });
    }

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

    const result = await uploadFile(file, "campaigns");

    return NextResponse.json({
      success: true,
      fileName: result.fileName,
      url: result.url,
      path: result.path,
    });
  } catch (e) {
    console.error("[GAUTEX UPLOAD]", e);
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
  }
}
