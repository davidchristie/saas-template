import { AuthenticationService, User } from "@saas/api-authentication-service";
import { WorkspaceService } from "@saas/api-workspace-service";
import bodyParser from "body-parser";
import { randomUUID } from "crypto";
import express, { Express } from "express";
import morgan from "morgan";
import { createAuthenticationHandler } from "./authentication";
import { createErrorRequestHandler } from "./error-handling";

declare global {
  namespace Express {
    interface Request {
      context?: Context;
    }
  }
}

interface Context {
  correlationId: string;
  user?: User;
}

export interface Props {
  authenticationService: AuthenticationService;
  workspaceService: WorkspaceService;
}

export function createExpressApp(props: Props): Express {
  const { authenticationService, workspaceService } = props;
  const app = express();
  const authenticated = createAuthenticationHandler({
    authenticationService,
  });
  app.use(morgan("tiny"));
  app.use(bodyParser.json());
  app.use((request, response, next) => {
    console.info(">>> request headers:", request.headers);
    console.info(">>> request body:", request.body);
    const correlationId = randomUUID();
    request.context = {
      correlationId,
    };
    response.set("Correlation-ID", correlationId);
    next();
  });
  app.post("/api/v1/signup", async (request, response) => {
    const result = await authenticationService.signup({
      givenName: request.body.givenName,
      familyName: request.body.familyName,
      email: request.body.email,
      password: request.body.password,
    });
    response.send(result);
  });
  app.post("/api/v1/login", async (request, response) => {
    const result = await authenticationService.login({
      email: request.body.email,
      password: request.body.password,
    });
    response.send(result);
  });
  app.get("/api/v1/me", authenticated, (request, response) => {
    response.send(request.context!.user);
  });
  app.post("/api/v1/workspaces", authenticated, async (request, response) => {
    const result = await workspaceService.createWorkspace({
      name: request.body.name,
    });
    response.send(result);
  });
  app.get("/api/v1/workspaces", authenticated, async (request, response) => {
    const result = await workspaceService.getWorkspaces({});
    response.send(result);
  });
  app.get(
    "/api/v1/workspaces/:workspaceId",
    authenticated,
    async (request, response) => {
      const result = await workspaceService.getWorkspace({
        id: request.params.workspaceId,
      });
      response.send(result);
    }
  );
  app.delete(
    "/api/v1/workspaces/:workspaceId",
    authenticated,
    async (request, response) => {
      const result = await workspaceService.deleteWorkspace({
        id: request.params.workspaceId,
      });
      response.send(result);
    }
  );
  app.use(createErrorRequestHandler());
  return app;
}
