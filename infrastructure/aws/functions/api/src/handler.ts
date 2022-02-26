import { createExpressApp } from "@saas/api";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { Request } from "express";
import serverless from "serverless-http";

export function createHandler(
  ...args: Parameters<typeof createExpressApp>
): ReturnType<typeof serverless> {
  const app = createExpressApp(...args);
  const appHandler = serverless(app, {
    request(request: Request, event: APIGatewayProxyEvent, context: Context) {
      if (event.body !== null) {
        try {
          request.body = JSON.parse(event.body);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    },
  });
  return async (event, context) => {
    console.log("Event:", event);
    console.log("Context:", context);
    const result = await appHandler(event, context);
    console.log("Result:", result);
    return result;
  };
}
