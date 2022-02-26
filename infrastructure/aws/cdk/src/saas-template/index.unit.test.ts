import { Template } from "aws-cdk-lib/assertions";
import { App } from "aws-cdk-lib";
import { SaasTemplateStack } from ".";

describe("SaasTemplateStack", () => {
  const app = new App();
  const stack = new SaasTemplateStack(app, "SaasTemplate");
  const template = Template.fromStack(stack);

  it("creates session dynamo table", () => {
    template.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: "sessions",
    });
  });

  it("creates user dynamo table", () => {
    template.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: "users",
    });
  });

  it("creates workspace dynamo table", () => {
    template.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: "workspaces",
    });
  });
});
