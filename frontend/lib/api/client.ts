import { useAuthStore } from "@/stores/auth";

// In browser use empty string → Next.js rewrites proxy to API gateway
// In server-side / build time use NEXT_PUBLIC_API_BASE
const API_BASE =
  typeof window !== "undefined"
    ? ""
    : (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8081");

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ApiRequestOptions extends RequestInit {
  token?: string;
  _retry?: boolean;
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const state = useAuthStore.getState();
    const refresh = state.refreshToken;
    if (!refresh) return null;

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Refresh-Token": refresh,
        },
      });
      if (!res.ok) {
        useAuthStore.getState().logout();
        return null;
      }
      const data = (await res.json()) as {
        accessToken: string;
        refreshToken: string;
      };
      state.setTokens(data.accessToken, data.refreshToken);
      if (typeof document !== "undefined") {
        document.cookie = `access_token=${data.accessToken}; path=/; SameSite=Lax`;
      }
      return data.accessToken;
    } catch {
      useAuthStore.getState().logout();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { token: optToken, _retry, ...fetchOptions } = options;
  const token = optToken ?? useAuthStore.getState().accessToken;

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
  });

  if (res.status === 401 && !_retry && !path.startsWith("/api/v1/auth/")) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiRequest<T>(path, { ...options, _retry: true, token: newToken });
    }
  }

  if (!res.ok) {
    let data: unknown;
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    throw new ApiError(
      (data as { detail?: string })?.detail ||
        (data as { message?: string })?.message ||
        `Request failed: ${res.status}`,
      res.status,
      data
    );
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}
