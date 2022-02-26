import { Method } from "@saas/http";
import { authenticatedRequest } from "../requests";

export async function postLogout(): Promise<void> {
  await authenticatedRequest(Method.POST, "/api/v1/logout");
}
