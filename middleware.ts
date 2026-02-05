import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/icon_with_text.svg") return NextResponse.next();

  if (pathname !== "/login") {
    const access_token = req.cookies.get("lyps_access_token");
    if (!access_token) {
      return NextResponse.redirect(new URL("/login", req.url));
    } else {
      return NextResponse.next();
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
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
