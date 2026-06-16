import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE = "gautex-distributor";

export async function POST(request: Request) {
  const { code } = await request.json();
  const expected = process.env.DISTRIBUTOR_ACCESS_CODE;

  if (!expected || code !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(COOKIE);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const jar = await cookies();
  return NextResponse.json({ authenticated: jar.get(COOKIE)?.value === "1" });
}
