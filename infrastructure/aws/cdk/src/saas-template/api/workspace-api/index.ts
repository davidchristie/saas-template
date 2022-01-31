import { Method } from "@saas/http";
import { RemovalPolicy } from "aws-cdk-lib";
import {
  LambdaIntegration,
  MethodOptions,
  Resource,
} from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path from "path";

export interface WorkspaceApiProps {
  defaultMethodOptions: MethodOptions;
  rootResource: Resource;
  tableName: string;
}

export class WorkspaceApi extends Construct {
  public constructor(scope: Construct, id: string, props: WorkspaceApiProps) {
    super(scope, id);

    const { defaultMethodOptions, rootResource, tableName } = props;

    const dynamoTable = new Table(this, "items", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName,

      /**
       *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new table, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will delete the table (even if it has data in it)
       */
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const handler = new NodejsFunction(this, "ApiWorkspaceHandler", {
      entry: path.resolve(
        __dirname,
        "../../../../../functions/api-workspace-handler/src/index.ts"
      ),
      environment: {
        DYNAMODB_TABLE_NAME: tableName,
      },
    });

    dynamoTable.grantFullAccess(handler);

    const getWorkspacesIntegration = new LambdaIntegration(handler);
    const postWorkspaceIntegration = new LambdaIntegration(handler);
    const getWorkspaceIntegration = new LambdaIntegration(handler);
    const deleteWorkspaceIntegration = new LambdaIntegration(handler);

    const workspacesResource = rootResource.addResource("workspaces", {
      // defaultMethodOptions,
    });

    workspacesResource.addMethod(
      Method.GET,
      getWorkspacesIntegration,
      defaultMethodOptions
    ); // GET /
    workspacesResource.addMethod(Method.POST, postWorkspaceIntegration); // POST /

    const workspaceIdResource = workspacesResource.addResource("{workspaceId}");

    workspaceIdResource.addMethod(Method.GET, getWorkspaceIntegration); // GET /{id}
    workspaceIdResource.addMethod(Method.DELETE, deleteWorkspaceIntegration); // DELETE /{id}
  }
}
