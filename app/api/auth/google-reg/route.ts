import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "../cookies";

export const runtime = "edge";

const GOOGLE_REG_URL = "https://api.lyhssa.org/v1/auth/googleReg";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendResponse = await fetch(GOOGLE_REG_URL, {
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
