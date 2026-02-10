import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const access_token = req.cookies.get("lyps_access_token");

  if (pathname === "/favicon.ico") return NextResponse.next();

  if (!pathname.startsWith("/login")) {
    if (!access_token) {
      return NextResponse.redirect(new URL("/login", req.url));
    } else {
      return NextResponse.next();
    }
  } else {
    if (access_token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: [
    /*
     * 匹配所有請求路徑，除了以下開頭的路徑：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (靜態資源)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
