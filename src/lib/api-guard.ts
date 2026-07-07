import { NextResponse } from "next/server";

export const MAX_JSON_BODY_BYTES = 100 * 1024;

function isGautexDeploymentHost(hostname: string): boolean {
  if (hostname.endsWith(".onrender.com")) return true;
  return hostname === "gautex.com" || hostname === "www.gautex.com";
}

function requestDeploymentOrigin(request: Request): string | null {
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host")?.split(":")[0];
  if (!host || !isGautexDeploymentHost(host)) return null;

  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (request.url.startsWith("https") ? "https" : "http");
  return `${proto}://${host}`;
}

function allowedOrigins(request?: Request): string[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const origins: string[] = [];

  if (siteUrl) {
    try {
      const url = new URL(siteUrl);
      origins.push(url.origin);

      if (url.hostname.startsWith("www.")) {
        const apex = new URL(url);
        apex.hostname = url.hostname.slice(4);
        origins.push(apex.origin);
      }
    } catch {
      /* ignore invalid URL */
    }
  }

  const extra =
    process.env.EXTRA_ALLOWED_ORIGINS?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];
  for (const value of extra) {
    try {
      origins.push(new URL(value.includes("://") ? value : `https://${value}`).origin);
    } catch {
      /* ignore invalid URL */
    }
  }

  if (request) {
    const deployment = requestDeploymentOrigin(request);
    if (deployment) origins.push(deployment);
  }

  if (process.env.NODE_ENV !== "production") {
    origins.push("http://localhost:3000", "http://127.0.0.1:3000");
  }

  return [...new Set(origins)];
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
  const allowed = allowedOrigins(request);
  const origin = requestOrigin(request);

  if (origin) {
    if (!allowed.includes(origin)) {
      return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
    }
    return null;
  }

  const deploymentOrigin = requestDeploymentOrigin(request);
  if (deploymentOrigin && allowed.includes(deploymentOrigin)) {
    return null;
  }

  if (allowed.length === 0 && process.env.NODE_ENV !== "production") {
    return null;
  }

  return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
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
