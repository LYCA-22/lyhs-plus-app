import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, setAuthCookies } from "../cookies";

const REFRESH_URL = "https://api.lyhssa.org/v1/auth/refresh";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("lyps_refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const backendResponse = await fetch(REFRESH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await backendResponse.json();

  if (!backendResponse.ok || !data.access_token) {
    const response = NextResponse.json(data, {
      status: backendResponse.status || 401,
    });
    clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.json({ ok: true });
  setAuthCookies(response, data);
  return response;
}
