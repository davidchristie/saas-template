import { Duration, RemovalPolicy } from "aws-cdk-lib";
import {
  AuthorizationType,
  IdentitySource,
  MethodOptions,
  RequestAuthorizer,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { randomUUID } from "crypto";
import { Auth } from "./auth";
import { WorkspaceApi } from "./workspace-api";

export class Api extends Construct {
  public restApi: RestApi;

  public constructor(scope: Construct, id: string) {
    super(scope, id);

    const authJwtSecret = randomUUID(); // TODO Store this in AWS SecretsManager.

    const sessionDynamoTable = new Table(this, "SessionDynamoTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "sessions",
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    const userDynamoTable = new Table(this, "UserDynamoTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "users",
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const authorizerFunction = new NodejsFunction(this, "AuthorizerFunction", {
      entry: "../functions/api-authorizer/src/index.ts",
      environment: {
        AUTH_JWT_SECRET: authJwtSecret, // TODO Get this from AWS SecretsManager
        SESSION_DYNAMO_TABLE: sessionDynamoTable.tableName,
        USER_DYNAMO_TABLE: userDynamoTable.tableName,
      },
      bundling: {
        externalModules: ["mock-aws-s3", "nock"],
      },
    });

    const authorizer = new RequestAuthorizer(this, "RequestAuthorizer", {
      handler: authorizerFunction,
      identitySources: [IdentitySource.header("Authorization")],
      resultsCacheTtl: Duration.seconds(0), // TODO
    });

    const defaultMethodOptions: MethodOptions = {
      authorizationType: AuthorizationType.CUSTOM,
      authorizer,
    };

    this.restApi = new RestApi(this, "RestApi", {
      restApiName: "API",
    });

    const rootResource = this.restApi.root.addResource("api");
    const v1Resource = rootResource.addResource("v1");

    new Auth(this, "Auth", {
      authJwtSecret,
      rootResource: v1Resource,
      sessionDynamoTable,
      userDynamoTable,
    });

    new WorkspaceApi(this, "WorkspaceApi", {
      defaultMethodOptions,
      rootResource: v1Resource,
      tableName: "workspaces",
    });
  }
}
