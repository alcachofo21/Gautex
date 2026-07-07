import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";
import { rateLimit, clientIp, RATE_LIMIT_UPLOAD } from "@/lib/rate-limit";
import { assertSameOrigin } from "@/lib/api-guard";
import { UPLOAD_MAX_SIZE, validateUploadBuffer } from "@/lib/upload-validation";

export async function POST(request: Request) {
  try {
    const originError = assertSameOrigin(request);
    if (originError) return originError;

    const ip = clientIp(request);
    const limited = rateLimit(`upload:${ip}`, RATE_LIMIT_UPLOAD);
    if (!limited.ok) {
      return NextResponse.json({ error: "Demasiadas subidas" }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    if (file.size > UPLOAD_MAX_SIZE) {
      return NextResponse.json({ error: "Archivo demasiado grande (máx. 5 MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const validation = await validateUploadBuffer(buffer, file.name, file.type);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const validatedFile = new File([buffer], file.name, { type: validation.mime });
    const result = await uploadFile(validatedFile, "campaigns");

    return NextResponse.json({
      success: true,
      fileName: result.fileName,
      url: result.url,
      path: result.path,
    });
  } catch (e) {
    console.error("[GAUTEX UPLOAD]", e);
    const msg = e instanceof Error ? e.message : "Error al subir archivo";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
