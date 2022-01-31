import { createContext } from "react";
import { User } from "../../types/user";

export interface Auth {
  isLoading: boolean;
  loggedInUser: User | null;
  login: (input: LoginInput) => void;
  logout: () => void;
  signup: (input: SignupInput) => void;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  familyName: string;
  givenName: string;
  password: string;
}

export const AuthContext = createContext<Auth>({
  isLoading: false,
  loggedInUser: null,
  login: () => undefined,
  logout: () => undefined,
  signup: () => undefined,
});
