import { Status } from "@saas/http";

export class ApiError extends Error {
  public readonly status: Status;

  public constructor(message: string, status: Status) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends ApiError {
  public constructor(message: string) {
    super(message, Status.BadRequest);
  }
}

export class ForbiddenError extends ApiError {
  public constructor(message: string) {
    super(message, Status.Forbidden);
  }
}

export class NotFoundError extends ApiError {
  public constructor(message: string) {
    super(message, Status.NotFound);
  }
}

export class UnauthorizedError extends ApiError {
  public constructor(message: string) {
    super(message, Status.Unauthorized);
  }
}
