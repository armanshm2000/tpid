import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const adminOnlyRoutes = ["/dashboard/audit"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = (req.nextauth.token as Record<string, unknown>)?.role as string | undefined;

    // Admin-only routes
    if (adminOnlyRoutes.some((r) => pathname.startsWith(r))) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Rate limit login and API routes
    if (pathname.startsWith("/api/")) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const result = rateLimit(`api:${ip}:${pathname}`, { windowMs: 60_000, max: 120 });

      if (!result.success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    // Rate limit login page specifically (stricter)
    if (pathname === "/login" || pathname.startsWith("/api/auth")) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const result = rateLimit(`auth:${ip}`, { windowMs: 900_000, max: 20 });

      if (!result.success) {
        return NextResponse.redirect(new URL("/login?error=rate-limited", req.url));
      }
    }

    return NextResponse.next();
  },
  { pages: { signIn: "/login" } }
);

export const config = { matcher: ["/dashboard/:path*", "/api/:path*"] };
