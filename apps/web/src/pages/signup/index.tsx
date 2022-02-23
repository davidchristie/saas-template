import { FormEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { loginPath } from "../../paths";

export function SignupPage(): JSX.Element {
  const auth = useAuth();
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    auth.signup({
      email,
      familyName,
      givenName,
      password,
    });
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="given_name">Given name</label>
          <input
            id="given_name"
            onChange={(event) => setGivenName(event.target.value)}
            required
            type="text"
            value={givenName}
          />
        </div>
        <div>
          <label htmlFor="family_name">Family name</label>
          <input
            id="family_name"
            onChange={(event) => setFamilyName(event.target.value)}
            required
            type="text"
            value={familyName}
          />
        </div>
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
        <button type="submit">Signup</button>
      </form>
      Go to <Link to={loginPath}>login</Link>.
    </div>
  );
}
