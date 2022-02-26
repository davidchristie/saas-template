import { ApiError } from "@saas/api-errors";
import { Status } from "@saas/http";
import { ErrorRequestHandler, Request, Response } from "express";

export function createErrorRequestHandler(): ErrorRequestHandler {
  return (error, request, response, next) => {
    if (error instanceof ApiError) {
      return sendErrorMessage(error.message, error.status, request, response);
    }
    // TODO Log unknown runtime exception.
    console.error("Error:", error);
    sendErrorMessage(
      "Something went wrong.",
      Status.InternalServerError,
      request,
      response
    );
  };
}

function sendErrorMessage(
  message: string,
  status: Status,
  request: Request,
  response: Response
): void {
  response
    .status(status)
    .set("Correlation-ID", request.context?.correlationId)
    .send({
      message,
      status,
    });
}
