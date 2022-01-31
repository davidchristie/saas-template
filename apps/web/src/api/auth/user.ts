import { Method } from "@saas/http";
import { User } from "../../types/user";
import { authenticatedQuery } from "../query";

export interface UserResult {
  data: User | null;
}

export async function getAuthUser(): Promise<UserResult> {
  return authenticatedQuery(Method.GET, "/api/v1/auth/user");
}
