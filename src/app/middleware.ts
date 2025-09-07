import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "./lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token || !verifyJwt(token)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}
