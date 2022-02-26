import { App } from "aws-cdk-lib";
import { SaasTemplateStack } from "./saas-template";

const app = new App();

new SaasTemplateStack(app, "SaasTemplate", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
