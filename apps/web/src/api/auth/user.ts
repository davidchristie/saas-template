import { Method } from "@saas/http";
import { User } from "../../types/user";
import { authenticatedRequest } from "../requests";

export interface UserResult {
  data: User | null;
}

export function getAuthUser(): Promise<UserResult> {
  return authenticatedRequest(Method.GET, "/api/v1/auth/user");
}
