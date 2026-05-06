import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const access_token = req.cookies.get("lyps_access_token");
  const refresh_token = req.cookies.get("lyps_refresh_token");

  if (pathname === "/favicon.ico") return NextResponse.next();

  if (!pathname.startsWith("/login")) {
    if (
      (!access_token || access_token.value == "") &&
      (!refresh_token || refresh_token.value == "")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    } else {
      return NextResponse.next();
    }
  } else {
    if (
      (access_token && access_token.value != "") ||
      (refresh_token && refresh_token.value != "")
    ) {
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
     * - favicon.ico, manifest.json, sw.js 等靜態檔案與 PWA 資源
     * - assets (靜態資源)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-|assets|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|json)).*)",
  ],
};
