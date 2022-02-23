import { DynamoDBWorkspaceRepository } from "@saas/aws-api-workspace-repository-dynamodb";
import { DefaultWorkspaceService } from "@saas/api-workspace-service";
import { APIGatewayProxyHandler } from "aws-lambda";
import * as aws from "aws-sdk";
import { errorHandler } from "@saas/aws-api-error-handler";

const tableName = process.env.WORKSPACE_DYNAMO_TABLE;

if (tableName === undefined) {
  throw new Error("WORKSPACE_DYNAMO_TABLE must be defined");
}

const dynamodb = new aws.DynamoDB.DocumentClient();

const workspaceRepository = new DynamoDBWorkspaceRepository({
  client: dynamodb,
  tableName,
});

const workspaceService = new DefaultWorkspaceService({
  workspaceRepository,
});

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log("Event:", event);
  console.log("Context:", context);

  return errorHandler(async () => {
    const method = event.httpMethod;

    // Get ID, if present
    const workspaceId = event.pathParameters?.workspaceId;

    if (method === "GET") {
      if (workspaceId === undefined) {
        // GET / to get all workspaces
        const workspaces = await workspaceService.getWorkspaces({});

        return {
          statusCode: 200,
          headers: {},
          body: JSON.stringify({
            data: workspaces,
          }),
        };
      } else {
        // GET /{id} to get workspace details
        const workspace = await workspaceService.getWorkspace({
          id: workspaceId,
        });

        return {
          statusCode: 200,
          headers: {},
          body: JSON.stringify({
            data: workspace,
          }),
        };
      }
    }

    if (method === "POST") {
      // POST /

      if (!event.body) {
        return {
          statusCode: 400,
          headers: {},
          body: "Request body missing",
        };
      }

      const body = JSON.parse(event.body);

      if (typeof body.name !== "string") {
        return {
          statusCode: 400,
          headers: {},
          body: "Workspace name missing",
        };
      }

      const workspace = await workspaceService.createWorkspace({
        name: body.name,
      });

      return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify({
          data: workspace,
        }),
      };
    }

    if (method === "DELETE") {
      // DELETE /{id}
      // Return an error if we do not have an ID
      if (!workspaceId) {
        return {
          statusCode: 400,
          headers: {},
          body: "Workspace ID missing",
        };
      }

      await workspaceService.deleteWorkspace({
        id: workspaceId,
      });

      return {
        statusCode: 200,
        headers: {},
        body: "Successfully deleted workspace " + workspaceId,
      };
    }

    // We got something besides a GET, POST, or DELETE
    return {
      statusCode: 400,
      headers: {},
      body: "We only accept GET, POST, and DELETE, not " + method,
    };
  });
};
