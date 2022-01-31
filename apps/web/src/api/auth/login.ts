import { User } from "../../types/user";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  data: User;
  token: string;
}

export async function postAuthLogin({
  email,
  password,
}: LoginInput): Promise<LoginResult> {
  const response = await fetch("/api/v1/auth/login", {
    body: JSON.stringify({
      email,
      password,
    }),
    method: "POST",
  });
  return response.json();
}
