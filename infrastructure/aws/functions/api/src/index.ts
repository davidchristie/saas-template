import { createExpressApp } from "@saas/api";
import { DefaultAuthenticationService } from "@saas/api-authentication-service";
import { DefaultWorkspaceService } from "@saas/api-workspace-service";
import { DynamoDBSessionRepository } from "@saas/aws-api-session-repository-dynamodb";
import { DynamoDBUserRepository } from "@saas/aws-api-user-repository-dynamodb";
import { DynamoDBWorkspaceRepository } from "@saas/aws-api-workspace-repository-dynamodb/src";
import {
  AUTH_JWT_SECRET,
  SESSION_DYNAMO_TABLE,
  USER_DYNAMO_TABLE,
  WORKSPACE_DYNAMO_TABLE,
} from "@saas/aws-environment";
import { requiredVariable } from "@saas/environment";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as aws from "aws-sdk";
import serverless from "serverless-http";
import { createHandler } from "./handler";

const dynamodb = new aws.DynamoDB.DocumentClient();

const sessionRepository = new DynamoDBSessionRepository({
  client: dynamodb,
  tableName: requiredVariable(SESSION_DYNAMO_TABLE),
});
const userRepository = new DynamoDBUserRepository({
  client: dynamodb,
  tableName: requiredVariable(USER_DYNAMO_TABLE),
});
const workspaceRepository = new DynamoDBWorkspaceRepository({
  client: dynamodb,
  tableName: requiredVariable(WORKSPACE_DYNAMO_TABLE),
});

const authenticationService = new DefaultAuthenticationService({
  jwtSecret: requiredVariable(AUTH_JWT_SECRET),
  sessionRepository,
  userRepository,
});
const workspaceService = new DefaultWorkspaceService({
  workspaceRepository,
});

export const handler = createHandler({
  authenticationService,
  workspaceService,
});
