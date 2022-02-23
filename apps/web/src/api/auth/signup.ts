import { Method } from "@saas/http";
import { User } from "../../types/user";
import { request } from "../requests";

export interface SignupInput {
  email: string;
  familyName: string;
  givenName: string;
  password: string;
}

export interface SignupResult {
  data: User;
  token: string;
}

export function postAuthSignup({
  email,
  familyName,
  givenName,
  password,
}: SignupInput): Promise<SignupResult> {
  return request(Method.POST, "/api/v1/auth/signup", {
    email,
    familyName,
    givenName,
    password,
  });
}
