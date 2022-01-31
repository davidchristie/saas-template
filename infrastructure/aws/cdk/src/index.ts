import { App } from "aws-cdk-lib";
import { SaasTemplate } from "./saas-template";

const app = new App();

new SaasTemplate(app, "SaasTemplate", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
