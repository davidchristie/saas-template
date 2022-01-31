import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAuthLogin } from "../../api/auth/login";
import { postAuthLogout } from "../../api/auth/logout";
import { postAuthSignup } from "../../api/auth/signup";
import { getAuthUser } from "../../api/auth/user";
import {
  Auth,
  AuthContext,
  LoginInput,
  SignupInput,
} from "../../contexts/auth";
import { loginPath, overviewPath } from "../../paths";
import {
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from "../../storage/auth/token";
import { User } from "../../types/user";

export interface AuthProviderProps {
  children?: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      if (getAuthToken() !== null) {
        const user = await getAuthUser();
        setLoggedInUser(user.data);
      }
      setLoading(false);
    })();
  }, []);

  const signup = async ({
    email,
    familyName,
    givenName,
    password,
  }: SignupInput) => {
    setLoading(true);
    setLoggedInUser(null);
    const result = await postAuthSignup({
      email,
      familyName,
      givenName,
      password,
    });
    setLoading(false);
    setLoggedInUser(result.data);
    setAuthToken(result.token);
    navigate(overviewPath);
  };

  const login = async ({ email, password }: LoginInput) => {
    setLoading(true);
    setLoggedInUser(null);
    const result = await postAuthLogin({
      email,
      password,
    });
    setLoading(false);
    setLoggedInUser(result.data);
    setAuthToken(result.token);
    navigate(overviewPath);
  };

  const logout = async () => {
    setLoading(true);
    setLoggedInUser(null);
    await postAuthLogout();
    setLoading(false);
    removeAuthToken();
    navigate(loginPath);
  };

  const auth: Auth = {
    isLoading,
    loggedInUser,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
