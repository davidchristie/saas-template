import { Method } from "@saas/http";
import { getAuthToken } from "../storage/auth/token";

export async function authenticatedRequest<T>(
  method: Method,
  path: string
): Promise<T> {
  const authToken = getAuthToken();
  const headers: HeadersInit = {};
  if (authToken !== null) {
    headers["Authorization"] = authToken;
  }
  const response = await fetch(path, {
    headers,
    method,
  });
  return response.json();
}

export async function request<T>(method: Method, path: string, body: unknown) {
  const response = await fetch(path, {
    body: JSON.stringify(body),
    method,
  });
  validateResponse(response);
  return response.json();
}

function validateResponse(response: Response): void {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
}
