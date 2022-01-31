import { FormEventHandler, useState } from "react";
import { useAuth } from "../../hooks/use-auth";

export function LoginPage(): JSX.Element {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();

    auth.login({ email, password });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
