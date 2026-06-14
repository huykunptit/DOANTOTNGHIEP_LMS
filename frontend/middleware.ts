import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const studentRoutes = ["/student"];
const instructorRoutes = ["/instructor"];
const adminRoutes = ["/admin"];
const protectedRoutes = ["/profile", "/orders", ...studentRoutes];

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

function getTokenPayload(token: string): { roles?: string[]; exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function homeForRoles(roles: string[]): string {
  if (roles.includes("ROLE_ADMIN")) return "/admin";
  if (roles.includes("ROLE_INSTRUCTOR")) return "/instructor";
  return "/student";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  let isAuthenticated = false;
  let roles: string[] = [];

  if (token) {
    const payload = getTokenPayload(token);
    if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
      isAuthenticated = true;
      roles = payload.roles || [];
    }
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(homeForRoles(roles), request.url));
    }
    return NextResponse.next();
  }

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!roles.includes("ROLE_ADMIN")) {
      return NextResponse.redirect(new URL(homeForRoles(roles), request.url));
    }
    return NextResponse.next();
  }

  if (instructorRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!roles.includes("ROLE_INSTRUCTOR") && !roles.includes("ROLE_ADMIN")) {
      return NextResponse.redirect(new URL(homeForRoles(roles), request.url));
    }
    return NextResponse.next();
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/instructor/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
