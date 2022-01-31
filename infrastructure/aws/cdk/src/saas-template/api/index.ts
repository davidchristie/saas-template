import { Duration } from "aws-cdk-lib";
import {
  AuthorizationType,
  IdentitySource,
  MethodOptions,
  RequestAuthorizer,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { Auth } from "./auth";
import { WorkspaceApi } from "./workspace-api";

export class Api extends Construct {
  public restApi: RestApi;

  public constructor(scope: Construct, id: string) {
    super(scope, id);

    const authorizerFunction = new NodejsFunction(this, "AuthorizerFunction", {
      entry: "../functions/api-authorizer/src/index.ts",
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
      rootResource: v1Resource,
    });

    new WorkspaceApi(this, "WorkspaceApi", {
      defaultMethodOptions,
      rootResource: v1Resource,
      tableName: "workspaces",
    });
  }
}
