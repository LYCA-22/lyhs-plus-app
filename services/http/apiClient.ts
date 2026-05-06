const API_ORIGIN = "https://api.lyhssa.org";
const BACKEND_PROXY_PREFIX = "/api/backend";

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiClientOptions {
  auth?: boolean;
  headers?: HeadersInit;
}

interface ApiClientBodyOptions extends ApiClientOptions {
  formData?: boolean;
}

const publicPathPrefixes = [
  "/v1/status",
  "/v1/lyps/list",
  "/v1/lyps/detail",
  "/v1/lyps/ann/list",
  "/v1/lyps/ann/view",
  "/v1/lyps/lunch/list",
  "/v1/lyps/ai/chat",
  "/v1/lyps/school/idSearch",
];

function isPublicPath(path: string) {
  return publicPathPrefixes.some((prefix) => path.startsWith(prefix));
}

function createRequestUrl(path: string, auth?: boolean) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const shouldUseProxy = auth ?? !isPublicPath(normalizedPath);

  if (shouldUseProxy) {
    return `${BACKEND_PROXY_PREFIX}${normalizedPath}`;
  }

  return `${API_ORIGIN}${normalizedPath}`;
}

async function request<T>(
  method: ApiMethod,
  path: string,
  body?: unknown,
  options: ApiClientBodyOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (body !== undefined && !options.formData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(createRequestUrl(path, options.auth), {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : options.formData
          ? (body as FormData)
          : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === "object" && data && "message" in data
        ? String(data.message)
        : `API request failed: ${response.status}`,
    );
  }

  return data as T;
}

export const apiClient = {
  raw(path: string, init?: RequestInit & { auth?: boolean }) {
    const { auth, ...requestInit } = init ?? {};
    return fetch(createRequestUrl(path, auth), requestInit);
  },
  get<T>(path: string, options?: ApiClientOptions) {
    return request<T>("GET", path, undefined, options);
  },
  post<T>(path: string, body?: unknown, options?: ApiClientBodyOptions) {
    return request<T>("POST", path, body, options);
  },
  put<T>(path: string, body?: unknown, options?: ApiClientBodyOptions) {
    return request<T>("PUT", path, body, options);
  },
  delete<T>(path: string, options?: ApiClientOptions) {
    return request<T>("DELETE", path, undefined, options);
  },
};

export { API_ORIGIN as API_BASE_URL };
