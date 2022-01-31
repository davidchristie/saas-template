import { User } from "../../types/user";

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

export async function postAuthSignup({
  email,
  familyName,
  givenName,
  password,
}: SignupInput): Promise<SignupResult> {
  const response = await fetch("/api/v1/auth/signup", {
    body: JSON.stringify({
      email,
      familyName,
      givenName,
      password,
    }),
    method: "POST",
  });
  return response.json();
}
