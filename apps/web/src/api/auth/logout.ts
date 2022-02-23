import { Method } from "@saas/http";
import { authenticatedRequest } from "../requests";

export async function postAuthLogout(): Promise<void> {
  await authenticatedRequest(Method.POST, "/api/v1/auth/logout");
}
