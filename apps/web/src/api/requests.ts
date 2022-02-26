import { ContentType, Method, Status } from "@saas/http";
import { getAuthToken, removeAuthToken } from "../storage/auth/token";

export async function authenticatedRequest<T>(
  method: Method,
  path: string
): Promise<T> {
  const authToken = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": ContentType.JSON,
  };
  if (authToken !== null) {
    headers["Authorization"] = authToken;
  }
  const response = await fetch(path, {
    headers,
    method,
  });
  if (response.status === Status.Unauthorized) {
    removeAuthToken();
    throw new Error(response.statusText);
  }
  return response.json();
}

export async function request<T>(method: Method, path: string, body: unknown) {
  const response = await fetch(path, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": ContentType.JSON,
    },
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
