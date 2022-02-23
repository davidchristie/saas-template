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
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setError(error);
    } else {
      setError(new Error(String(error)));
    }
  };

  useEffect(() => {
    (async () => {
      if (getAuthToken() !== null) {
        setLoading(true);
        try {
          const user = await getAuthUser();
          setLoggedInUser(user.data);
        } catch (error) {
          handleError(error);
        }
        setLoading(false);
      }
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
    try {
      const result = await postAuthSignup({
        email,
        familyName,
        givenName,
        password,
      });
      setLoggedInUser(result.data);
      setAuthToken(result.token);
      navigate(overviewPath);
    } catch (error) {
      handleError(error);
    }
    setLoading(false);
  };

  const login = async ({ email, password }: LoginInput) => {
    setLoading(true);
    setLoggedInUser(null);
    try {
      const result = await postAuthLogin({
        email,
        password,
      });
      setLoggedInUser(result.data);
      setAuthToken(result.token);
      navigate(overviewPath);
    } catch (error) {
      handleError(error);
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    setLoggedInUser(null);
    try {
      await postAuthLogout();
      removeAuthToken();
      navigate(loginPath);
    } catch (error) {
      handleError(error);
    }
    setLoading(false);
  };

  if (error !== null) {
    return <div>{error.message}</div>;
  }

  const auth: Auth = {
    isLoading,
    loggedInUser,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
