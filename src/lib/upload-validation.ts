import { fileTypeFromBuffer } from "file-type";

export const UPLOAD_MAX_SIZE = 5 * 1024 * 1024;

export const UPLOAD_ALLOWED_MIME = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
] as const;

const BLOCKED_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".ps1",
  ".svg",
  ".html",
  ".htm",
  ".js",
  ".mjs",
  ".php",
]);

export function isBlockedExtension(fileName: string): boolean {
  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf("."));
  return BLOCKED_EXTENSIONS.has(ext);
}

export async function validateUploadBuffer(
  buffer: Buffer,
  fileName: string,
  declaredMime: string
): Promise<{ ok: true; mime: string } | { ok: false; error: string }> {
  if (isBlockedExtension(fileName)) {
    return { ok: false, error: "Extensión de archivo no permitida" };
  }

  if (!UPLOAD_ALLOWED_MIME.includes(declaredMime as (typeof UPLOAD_ALLOWED_MIME)[number])) {
    return { ok: false, error: "Formato no permitido (PNG, JPG, PDF)" };
  }

  const detected = await fileTypeFromBuffer(buffer);
  if (!detected) {
    return { ok: false, error: "No se pudo verificar el tipo de archivo" };
  }

  const allowedDetected =
    detected.mime === "image/png" ||
    detected.mime === "image/jpeg" ||
    detected.mime === "application/pdf";

  if (!allowedDetected) {
    return { ok: false, error: "Formato no permitido (PNG, JPG, PDF)" };
  }

  if (declaredMime === "image/jpg" && detected.mime !== "image/jpeg") {
    return { ok: false, error: "El tipo declarado no coincide con el archivo" };
  }

  if (declaredMime !== "image/jpg" && detected.mime !== declaredMime) {
    return { ok: false, error: "El tipo declarado no coincide con el archivo" };
  }

  return { ok: true, mime: detected.mime };
}
