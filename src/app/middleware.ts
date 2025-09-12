import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "../lib/auth";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/transcript",
  "/profile",
  "/api/transcripts",
];

const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
};

export function middleware(req: NextRequest) {
  // Only run middleware for protected routes
  if (!isProtectedRoute(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // No token found, redirect to login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("tab", "login");
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Verify the token
  const payload = verifyJwt(token);
  if (!payload) {
    // Invalid token, redirect to login
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("tab", "login");
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Valid token, allow the request
  return NextResponse.next();
}

// Configure the matcher for optimized middleware execution
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transcript/:path*",
    "/profile/:path*",
    "/api/transcripts/:path*",
  ],
};
