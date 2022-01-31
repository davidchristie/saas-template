import { Method } from "@saas/http";
import { LambdaIntegration, Resource } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path from "path";

export interface AuthProps {
  rootResource: Resource;
}

export class Auth extends Construct {
  public constructor(scope: Construct, id: string, props: AuthProps) {
    super(scope, id);

    const { rootResource } = props;

    const authResource = rootResource.addResource("auth");
    const signupResource = authResource.addResource("signup");
    const loginResource = authResource.addResource("login");
    const logoutResource = authResource.addResource("logout");
    const userResource = authResource.addResource("user");

    signupResource.addMethod(
      Method.POST,
      new LambdaIntegration(
        new NodejsFunction(this, "ApiAuthSignup", {
          entry: path.resolve(
            __dirname,
            "../../../../../functions/api-auth-signup/src/index.ts"
          ),
        })
      )
    );

    loginResource.addMethod(
      Method.POST,
      new LambdaIntegration(
        new NodejsFunction(this, "ApiAuthLogin", {
          entry: path.resolve(
            __dirname,
            "../../../../../functions/api-auth-login/src/index.ts"
          ),
        })
      )
    );

    logoutResource.addMethod(
      Method.POST,
      new LambdaIntegration(
        new NodejsFunction(this, "ApiAuthLogout", {
          entry: path.resolve(
            __dirname,
            "../../../../../functions/api-auth-logout/src/index.ts"
          ),
        })
      )
    );

    userResource.addMethod(
      Method.GET,
      new LambdaIntegration(
        new NodejsFunction(this, "ApiAuthUser", {
          entry: path.resolve(
            __dirname,
            "../../../../../functions/api-auth-user/src/index.ts"
          ),
        })
      )
    );
  }
}
