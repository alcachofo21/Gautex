import { NextResponse } from "next/server";

export const MAX_JSON_BODY_BYTES = 100 * 1024;

function allowedOrigins(): string[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const origins: string[] = [];

  if (siteUrl) {
    try {
      const url = new URL(siteUrl);
      origins.push(url.origin);

      // Allow apex when canonical host is www (e.g. gautex.com + www.gautex.com)
      if (url.hostname.startsWith("www.")) {
        const apex = new URL(url);
        apex.hostname = url.hostname.slice(4);
        origins.push(apex.origin);
      }
    } catch {
      /* ignore invalid URL */
    }
  }

  if (process.env.NODE_ENV !== "production") {
    origins.push("http://localhost:3000", "http://127.0.0.1:3000");
  }

  return origins;
}

function requestOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  if (origin) return origin;

  const referer = request.headers.get("referer");
  if (!referer) return null;

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

export function assertSameOrigin(request: Request): NextResponse | null {
  const origin = requestOrigin(request);
  if (!origin) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }

  const allowed = allowedOrigins();
  if (allowed.length === 0 && process.env.NODE_ENV !== "production") {
    return null;
  }

  if (!allowed.includes(origin)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }

  return null;
}

export async function readJsonBodyWithLimit(
  request: Request,
  maxBytes = MAX_JSON_BODY_BYTES
): Promise<{ body: unknown } | { error: NextResponse }> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    return {
      error: NextResponse.json({ error: "Cuerpo de solicitud demasiado grande" }, { status: 413 }),
    };
  }

  const raw = await request.text();
  if (raw.length > maxBytes) {
    return {
      error: NextResponse.json({ error: "Cuerpo de solicitud demasiado grande" }, { status: 413 }),
    };
  }

  try {
    return { body: raw ? JSON.parse(raw) : {} };
  } catch {
    return { error: NextResponse.json({ error: "JSON inválido" }, { status: 400 }) };
  }
}
