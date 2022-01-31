import { Method } from "@saas/http";
import { getAuthToken } from "../storage/auth/token";

export async function authenticatedQuery<T>(
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
