import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/learn", "/my-courses", "/profile", "/orders"];
const adminRoutes = ["/admin"];
const instructorRoutes = ["/instructor"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

function getTokenPayload(token: string): { roles?: string[]; exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // Check if token exists and is not expired
  let isAuthenticated = false;
  let roles: string[] = [];

  if (token) {
    const payload = getTokenPayload(token);
    if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
      isAuthenticated = true;
      roles = payload.roles || [];
    }
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protect authenticated routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Admin guard
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!roles.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Instructor guard
  if (instructorRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!roles.includes("INSTRUCTOR") && !roles.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/learn/:path*",
    "/my-courses/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/admin/:path*",
    "/instructor/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};

