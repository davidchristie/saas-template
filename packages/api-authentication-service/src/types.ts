export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  givenName: string;
  familyName: string;
  email: string;
}

export interface SignupArgs {
  givenName: string;
  familyName: string;
  email: string;
  password: string;
}

export interface AuthenticateResult {
  user: User;
}

export interface SignupResult {
  user: User;
  token: string;
}

export interface LoginArgs {
  email: string;
  password: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

export interface LogoutArgs {
  token: string | null;
}

export interface AuthenticateArgs {
  token: string | null;
}

export interface AuthenticationService {
  authenticate(args: AuthenticateArgs): Promise<AuthenticateResult>;
  login(args: LoginArgs): Promise<LoginResult>;
  logout(args: LogoutArgs): Promise<void>;
  signup(args: SignupArgs): Promise<SignupResult>;
}
