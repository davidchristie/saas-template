import { Method } from "@saas/http";
import { User } from "../../types/user";
import { request } from "../requests";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  data: User;
  token: string;
}

export function postLogin({
  email,
  password,
}: LoginInput): Promise<LoginResult> {
  return request(Method.POST, "/api/v1/login", {
    email,
    password,
  });
}
