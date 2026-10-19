export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function apiBase() {
  const configured = import.meta.env.VITE_API_BASE_URL
  if (configured) return configured.replace(/\/$/, "")
  if (typeof window === "undefined") return ""
  const host = window.location.hostname
  if (host === "127.0.0.1" || host === "localhost") return `${window.location.protocol}//${host}:8787`
  return ""
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${apiBase()}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        ...(init?.body ? { "content-type": "application/json" } : {}),
        ...(init?.headers ?? {}),
      },
    })
  } catch {
    throw new ApiError(0, "The referral service is unavailable.")
  }
  const data = (await response.json().catch(() => ({}))) as { error?: string }
  if (!response.ok) throw new ApiError(response.status, data.error || "The request failed.")
  return data as T
}
