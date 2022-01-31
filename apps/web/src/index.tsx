import { StrictMode } from "react";
import { render } from "react-dom";
import { App } from "./app";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/auth";

render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);
