import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { WorkspaceApi } from ".";

describe("WorkspaceApi", () => {
  const expectedResourceCounts: Record<string, number> = {
    "AWS::ApiGateway::Account": 1,
    "AWS::ApiGateway::Deployment": 1,
    "AWS::ApiGateway::Method": 4,
    "AWS::ApiGateway::Resource": 3,
    "AWS::ApiGateway::RestApi": 1,
    "AWS::ApiGateway::Stage": 1,
    "AWS::DynamoDB::Table": 1,
    "AWS::Lambda::Function": 1,
    "AWS::Lambda::Permission": 8,
    "AWS::IAM::Policy": 1,
    "AWS::IAM::Role": 2,
  };

  let template: Template;

  beforeAll(() => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const api = new apigateway.RestApi(stack, "test-workspace-api");
    const rootResource = api.root.addResource("test_workspaces");
    new WorkspaceApi(stack, "TestWorkspaceApi", {
      defaultMethodOptions: {},
      rootResource,
      tableName: "test_workspaces",
    });
    template = Template.fromStack(stack);
  });

  Object.entries(expectedResourceCounts).map(([type, count]) => {
    test(`${type} -- count: ${count}`, () => {
      template.resourceCountIs(type, count);
    });
  });
});
