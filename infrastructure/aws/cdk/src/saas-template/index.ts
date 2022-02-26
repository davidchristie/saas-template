import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Api } from "./api";
import { Ui } from "./ui";

export class SaasTemplateStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new Api(this, "Api");

    new Ui(this, "Ui", {
      region: this.region,
      restApi: api.restApi,
      urlSuffix: this.urlSuffix,
    });
  }
}
