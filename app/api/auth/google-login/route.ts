import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "../cookies";

const GOOGLE_LOGIN_URL =
  "https://lyhs-app-backend.lysa23.workers.dev/v1/auth/googleLogin";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await fetch(GOOGLE_LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json();

  if (!backendResponse.ok) {
    return NextResponse.json(data, { status: backendResponse.status });
  }

  const response = NextResponse.json({ ok: true });
  setAuthCookies(response, data);
  return response;
}
