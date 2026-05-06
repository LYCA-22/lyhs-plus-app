import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "../cookies";

export const runtime = "edge";

const LOGOUT_URL = "https://api.lyhssa.org/v1/auth/logout";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("lyps_refresh_token")?.value;

  if (refreshToken) {
    await fetch(LOGOUT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
