import { Method } from "@saas/http";
import { LambdaIntegration, Resource } from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path from "path";

export interface AuthProps {
  authJwtSecret: string;
  rootResource: Resource;
  sessionDynamoTable: Table;
  userDynamoTable: Table;
}

export class Auth extends Construct {
  public constructor(scope: Construct, id: string, props: AuthProps) {
    super(scope, id);

    const { authJwtSecret, rootResource, sessionDynamoTable, userDynamoTable } =
      props;

    const signupHandler = new NodejsFunction(this, "ApiAuthSignup", {
      entry: path.resolve(
        __dirname,
        "../../../../../functions/api-auth-signup/src/index.ts"
      ),
      environment: {
        AUTH_JWT_SECRET: authJwtSecret,
        SESSION_DYNAMO_TABLE: sessionDynamoTable.tableName,
        USER_DYNAMO_TABLE: userDynamoTable.tableName,
      },
    });
    const loginHandler = new NodejsFunction(this, "ApiAuthLogin", {
      entry: path.resolve(
        __dirname,
        "../../../../../functions/api-auth-login/src/index.ts"
      ),
      environment: {
        AUTH_JWT_SECRET: authJwtSecret,
        SESSION_DYNAMO_TABLE: sessionDynamoTable.tableName,
        USER_DYNAMO_TABLE: userDynamoTable.tableName,
      },
    });
    const logoutHandler = new NodejsFunction(this, "ApiAuthLogout", {
      entry: path.resolve(
        __dirname,
        "../../../../../functions/api-auth-logout/src/index.ts"
      ),
      environment: {
        AUTH_JWT_SECRET: authJwtSecret,
        SESSION_DYNAMO_TABLE: sessionDynamoTable.tableName,
        USER_DYNAMO_TABLE: userDynamoTable.tableName,
      },
    });
    const userHandler = new NodejsFunction(this, "ApiAuthUser", {
      entry: path.resolve(
        __dirname,
        "../../../../../functions/api-auth-user/src/index.ts"
      ),
      environment: {
        AUTH_JWT_SECRET: authJwtSecret,
        SESSION_DYNAMO_TABLE: sessionDynamoTable.tableName,
        USER_DYNAMO_TABLE: userDynamoTable.tableName,
      },
    });

    sessionDynamoTable.grantReadWriteData(signupHandler);
    sessionDynamoTable.grantReadWriteData(loginHandler);
    sessionDynamoTable.grantReadWriteData(logoutHandler);
    sessionDynamoTable.grantReadData(userHandler);

    userDynamoTable.grantReadWriteData(signupHandler);
    userDynamoTable.grantReadWriteData(loginHandler);
    userDynamoTable.grantReadWriteData(logoutHandler);
    userDynamoTable.grantReadData(userHandler);

    const authResource = rootResource.addResource("auth");
    const signupResource = authResource.addResource("signup");
    const loginResource = authResource.addResource("login");
    const logoutResource = authResource.addResource("logout");
    const userResource = authResource.addResource("user");

    signupResource.addMethod(Method.POST, new LambdaIntegration(signupHandler));
    loginResource.addMethod(Method.POST, new LambdaIntegration(loginHandler));

    logoutResource.addMethod(Method.POST, new LambdaIntegration(logoutHandler));

    userResource.addMethod(Method.GET, new LambdaIntegration(userHandler));
  }
}
