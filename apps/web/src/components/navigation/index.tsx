import { ReactNode } from "react";
import { useAuth } from "../../hooks/use-auth";

export interface NavigationProps {
  children?: ReactNode;
}

export function Navigation({ children }: NavigationProps): JSX.Element {
  const auth = useAuth();

  return (
    <div>
      <header>
        <pre>{JSON.stringify(auth.loggedInUser, null, 2)}</pre>
        <button onClick={auth.logout}>Logout</button>
      </header>
      <main>{children}</main>
    </div>
  );
}
