import { DefaultAuthenticationService } from "@saas/api-authentication-service";
import { DynamoDBSessionRepository } from "@saas/aws-api-session-repository-dynamodb";
import { DynamoDBUserRepository } from "@saas/aws-api-user-repository-dynamodb";
import { requiredVariable } from "@saas/environment";
import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerHandler,
} from "aws-lambda";
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

export const handler: APIGatewayRequestAuthorizerHandler = async (
  event,
  context
) => {
  console.log("Event:", JSON.stringify(event, null, 2));
  console.log("Context:", JSON.stringify(context, null, 2));

  const authenticationHeader = event.headers?.Authorization ?? null;

  try {
    const result = await authenticationService.authenticate({
      token: authenticationHeader,
    });

    const context = {
      user: result.user,
    };

    return generatePolicy("user", "Allow", event.methodArn, context);
  } catch (error) {
    console.log("Error:", error);
  }

  return generatePolicy("user", "Deny", event.methodArn, null);

  // if (
  //   event.headers?["Authorization"] &&
  //   event.headers["Authorization"] !== "fail"
  // ) {
  //   return generatePolicy("user", "Allow", event.methodArn);
  // } else {
  //   return generatePolicy("user", "Deny", event.methodArn);
  // }
};

// Help function to generate an IAM policy
const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
  context: unknown
): APIGatewayAuthorizerResult => {
  var authResponse: any = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument: any = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne: any = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  authResponse.context = context;

  return authResponse;
};
