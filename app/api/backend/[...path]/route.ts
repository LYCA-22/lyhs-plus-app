import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, setAuthCookies } from "../../auth/cookies";

export const runtime = "edge";

const API_ORIGIN = "https://api.lyhssa.org";
const REFRESH_URL = `${API_ORIGIN}/v1/auth/refresh`;

type BackendMethod = "GET" | "POST" | "PUT" | "DELETE";

async function refreshAccessToken(request: NextRequest) {
  const refreshToken = request.cookies.get("lyps_refresh_token")?.value;

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(REFRESH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    return null;
  }

  return data;
}

function createBackendUrl(request: NextRequest, path: string[]) {
  const url = new URL(request.url);
  return `${API_ORIGIN}/${path.join("/")}${url.search}`;
}

function createForwardHeaders(request: NextRequest, accessToken?: string) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const ksaAuthKey = request.headers.get("ksaauthkey");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (ksaAuthKey) {
    headers.set("KsaAuthKey", ksaAuthKey);
  }

  return headers;
}

async function forwardRequest(
  request: NextRequest,
  path: string[],
  method: BackendMethod,
) {
  const body = method === "GET" ? undefined : await request.arrayBuffer();
  const backendUrl = createBackendUrl(request, path);
  let accessToken = request.cookies.get("lyps_access_token")?.value;
  let refreshedTokenData = null;

  if (!accessToken) {
    refreshedTokenData = await refreshAccessToken(request);
    accessToken = refreshedTokenData?.access_token;
  }

  let backendResponse = await fetch(backendUrl, {
    method,
    headers: createForwardHeaders(request, accessToken),
    body,
  });

  if (backendResponse.status === 401) {
    refreshedTokenData = await refreshAccessToken(request);

    if (refreshedTokenData?.access_token) {
      backendResponse = await fetch(backendUrl, {
        method,
        headers: createForwardHeaders(request, refreshedTokenData.access_token),
        body,
      });
    }
  }

  const responseBody = await backendResponse.arrayBuffer();
  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "Content-Type":
        backendResponse.headers.get("content-type") ?? "application/json",
    },
  });

  if (refreshedTokenData?.access_token) {
    setAuthCookies(response, refreshedTokenData);
  } else if (backendResponse.status === 401) {
    clearAuthCookies(response);
  }

  return response;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forwardRequest(request, path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forwardRequest(request, path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forwardRequest(request, path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forwardRequest(request, path, "DELETE");
}
