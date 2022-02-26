import { Method } from "@saas/http";
import { User } from "../../types/user";
import { authenticatedRequest } from "../requests";

export interface UserResult {
  data: User | null;
}

export function getMe(): Promise<UserResult> {
  return authenticatedRequest(Method.GET, "/api/v1/me");
}
