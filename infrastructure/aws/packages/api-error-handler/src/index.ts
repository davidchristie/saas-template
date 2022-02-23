import { ApiError } from "@saas/api-errors";
import { Status } from "@saas/http";
import { APIGatewayProxyResult } from "aws-lambda";

export async function errorHandler(
  fn: () => APIGatewayProxyResult | Promise<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.status);
    }

    console.log("ERROR:", error);
    return errorResponse("Something went wrong.", Status.InternalServerError);
  }
}

function errorResponse(message: string, status: number): APIGatewayProxyResult {
  return {
    body: JSON.stringify({
      message,
    }),
    statusCode: status,
  };
}
