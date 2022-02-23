import { DefaultAuthenticationService } from "@saas/api-authentication-service";
import { errorHandler } from "@saas/aws-api-error-handler";
import { DynamoDBSessionRepository } from "@saas/aws-api-session-repository-dynamodb";
import { DynamoDBUserRepository } from "@saas/aws-api-user-repository-dynamodb";
import { requiredVariable } from "@saas/environment";
import { Status } from "@saas/http";
import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const jwtSecret = requiredVariable("AUTH_JWT_SECRET");
const sessionTable = requiredVariable("SESSION_DYNAMO_TABLE");
const userTable = requiredVariable("USER_DYNAMO_TABLE");

const dynamodb = new DynamoDB.DocumentClient();

const sessionRepository = new DynamoDBSessionRepository({
  client: dynamodb,
  tableName: sessionTable,
});
const userRepository = new DynamoDBUserRepository({
  client: dynamodb,
  tableName: userTable,
});
const authenticationService = new DefaultAuthenticationService({
  jwtSecret,
  sessionRepository,
  userRepository,
});

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log("Event:", event);
  console.log("Context:", context);

  return errorHandler(async () => {
    const token = event.headers?.Authorization ?? null;

    await authenticationService.logout({
      token,
    });

    return {
      statusCode: Status.OK,
      headers: {},
      body: JSON.stringify({}),
    };
  });
};
