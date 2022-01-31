import { Navigate, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { useAuth } from "./hooks/use-auth";
import { LoadingPage } from "./pages/loading";
import { LoginPage } from "./pages/login";
import { NotFoundPage } from "./pages/not-found";
import { OverviewPage } from "./pages/overview";
import { SignupPage } from "./pages/signup";
import { loginPath, overviewPath, signupPath } from "./paths";

export function App(): JSX.Element {
  const auth = useAuth();

  if (auth.isLoading) {
    return <LoadingPage />;
  }

  if (auth.loggedInUser === null) {
    return (
      <Routes>
        <Route element={<SignupPage />} path={signupPath} />
        <Route element={<LoginPage />} path={loginPath} />
        <Route element={<Navigate to={signupPath} />} path="*" />
      </Routes>
    );
  }

  return (
    <Navigation>
      <Routes>
        <Route element={<OverviewPage />} path={overviewPath} />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </Navigation>
  );
}
