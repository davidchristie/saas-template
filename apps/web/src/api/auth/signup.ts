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

export function postSignup({
  email,
  familyName,
  givenName,
  password,
}: SignupInput): Promise<SignupResult> {
  return request(Method.POST, "/api/v1/signup", {
    email,
    familyName,
    givenName,
    password,
  });
}
