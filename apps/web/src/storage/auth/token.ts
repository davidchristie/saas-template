const key = "auth_token";

export function getAuthToken(): string | null {
  return localStorage.getItem(key);
}

export function removeAuthToken(): void {
  localStorage.removeItem(key);
}

export function setAuthToken(authToken: string): void {
  localStorage.setItem(key, authToken);
}
