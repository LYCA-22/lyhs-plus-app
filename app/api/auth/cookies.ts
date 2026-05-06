import { NextResponse } from "next/server";

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
}

const isProduction = process.env.NODE_ENV === "production";

export function setAuthCookies(
  response: NextResponse,
  tokenData: TokenResponse,
) {
  if (tokenData.access_token) {
    response.cookies.set("lyps_access_token", tokenData.access_token, {
      path: "/",
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge: tokenData.expires_in,
    });
  }

  if (tokenData.refresh_token) {
    response.cookies.set("lyps_refresh_token", tokenData.refresh_token, {
      path: "/",
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: tokenData.refresh_expires_in,
    });
  }
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set("lyps_access_token", "", {
    path: "/",
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 0,
  });
  response.cookies.set("lyps_refresh_token", "", {
    path: "/",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 0,
  });
}
