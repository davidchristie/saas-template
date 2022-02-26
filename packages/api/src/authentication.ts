import { AuthenticationService } from "@saas/api-authentication-service";
import { RequestHandler } from "express";

export interface CreateAuthenticationHandlerArgs {
  authenticationService: AuthenticationService;
}

export function createAuthenticationHandler(
  args: CreateAuthenticationHandlerArgs
): RequestHandler {
  const { authenticationService } = args;
  return async (request, response, next) => {
    try {
      request.context!.user = await authenticationService.authenticate({
        token: request.headers.authorization ?? null,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}
