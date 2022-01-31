export async function postAuthLogout(): Promise<void> {
  await fetch("/api/v1/auth/logout", {
    method: "POST",
  });
}
