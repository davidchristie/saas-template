export enum ContentType {
  JSON = "application/json",
}

export enum Method {
  GET = "GET",
  DELETE = "DELETE",
  POST = "POST",
  PUT = "PUT",
}

export enum Status {
  BadRequest = 400,
  Forbidden = 403,
  InternalServerError = 500,
  NotFound = 404,
  OK = 200,
  Unauthorized = 401,
}
