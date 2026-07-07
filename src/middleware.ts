import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function buildCsp(): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://plausible.io",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com https://plausible.io https://api.stripe.com https://api-m.paypal.com https://api-m.sandbox.paypal.com",
    "frame-src https://js.stripe.com https://www.paypal.com https://www.sandbox.paypal.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  return directives.join("; ");
}

export function middleware(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const host = request.headers.get("host")?.split(":")[0];

  if (siteUrl && host) {
    try {
      const canonical = new URL(siteUrl);
      const apexHost = canonical.hostname.startsWith("www.")
        ? canonical.hostname.slice(4)
        : null;

      if (apexHost && host === apexHost) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.protocol = canonical.protocol;
        redirectUrl.host = canonical.host;
        return NextResponse.redirect(redirectUrl, 301);
      }
    } catch {
      /* ignore invalid NEXT_PUBLIC_SITE_URL */
    }
  }

  const response = NextResponse.next();

  response.headers.set("Content-Security-Policy", buildCsp());
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-DNS-Prefetch-Control", "on");

  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
