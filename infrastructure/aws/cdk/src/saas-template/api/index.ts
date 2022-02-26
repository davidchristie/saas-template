import {
  AUTH_JWT_SECRET,
  SESSION_DYNAMO_TABLE,
  USER_DYNAMO_TABLE,
  WORKSPACE_DYNAMO_TABLE,
} from "@saas/aws-environment";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { LambdaRestApi, RestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { randomUUID } from "crypto";

export class Api extends Construct {
  public restApi: RestApi;

  public constructor(scope: Construct, id: string) {
    super(scope, id);

    const authJwtSecret = randomUUID(); // TODO Store this in AWS SecretsManager.

    const userDynamoTable = new Table(this, "UserDynamoTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "users",
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    const sessionDynamoTable = new Table(this, "SessionDynamoTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "sessions",
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    const workspaceDynamoTable = new Table(this, "WorkspaceDynamoTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "workspaces",
      /**
       *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new table, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will delete the table (even if it has data in it)
       */
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const apiFunction = new NodejsFunction(this, "ApiFunction", {
      entry: "../functions/api/src/index.ts",
      timeout: Duration.seconds(30),
      awsSdkConnectionReuse: true,
      environment: {
        [AUTH_JWT_SECRET]: authJwtSecret, // TODO Get this from AWS SecretsManager
        [SESSION_DYNAMO_TABLE]: sessionDynamoTable.tableName,
        [USER_DYNAMO_TABLE]: userDynamoTable.tableName,
        [WORKSPACE_DYNAMO_TABLE]: workspaceDynamoTable.tableName,
      },
      bundling: {
        externalModules: ["mock-aws-s3", "nock"], // FIXME Remove this line
      },
    });

    userDynamoTable.grantFullAccess(apiFunction);
    sessionDynamoTable.grantFullAccess(apiFunction);
    workspaceDynamoTable.grantFullAccess(apiFunction);

    this.restApi = new LambdaRestApi(this, "RestApi", {
      handler: apiFunction,
    });
  }
}
