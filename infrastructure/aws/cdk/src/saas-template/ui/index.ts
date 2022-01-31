import { CfnOutput, Duration, RemovalPolicy } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import {
  CacheHeaderBehavior,
  CachePolicy,
  CloudFrontAllowedMethods,
  CloudFrontWebDistribution,
  Distribution,
  OriginAccessIdentity,
  OriginRequestCookieBehavior,
  OriginRequestHeaderBehavior,
  OriginRequestPolicy,
  OriginRequestQueryStringBehavior,
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export interface UiStackProps {
  region: string;
  restApi: RestApi;
  urlSuffix: string;
}

export class Ui extends Construct {
  public constructor(scope: Construct, id: string, props: UiStackProps) {
    super(scope, id);

    const { region, restApi, urlSuffix } = props;

    const websiteBucket = new Bucket(this, "WebsiteBucket", {
      autoDeleteObjects: true, // TODO: Not recommended for production.
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      // publicReadAccess: true, // TODO: Not recommended for production.
      removalPolicy: RemovalPolicy.DESTROY, // TODO: Not recommended for production.
      // websiteErrorDocument: "index.html",
      websiteIndexDocument: "index.html",
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "WebsiteBucketOriginAccessIdentity"
    );

    websiteBucket.grantRead(originAccessIdentity);

    const distribution = new CloudFrontWebDistribution(
      this,
      "WebsiteDistribution",
      {
        errorConfigurations: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
        ],
        originConfigs: [
          {
            behaviors: [
              {
                defaultTtl: Duration.seconds(0), // TODO
                isDefaultBehavior: true,
              },
            ],
            s3OriginSource: {
              originAccessIdentity,
              s3BucketSource: websiteBucket,
            },
          },
          {
            behaviors: [
              {
                allowedMethods: CloudFrontAllowedMethods.ALL,
                defaultTtl: Duration.seconds(0), // TODO
                forwardedValues: {
                  headers: ["Authorization"],
                  queryString: false,
                },
                pathPattern: "/api/*",
              },
            ],
            customOriginSource: {
              domainName: `${restApi.restApiId}.execute-api.${region}.${urlSuffix}`,
              originPath: `/${restApi.deploymentStage.stageName}`,
            },
          },
        ],
      }
    );

    new CfnOutput(this, "WebsiteS3Url", {
      value: websiteBucket.bucketWebsiteUrl,
    });

    new CfnOutput(this, "WebsiteCloudfrontUrl", {
      value: "https://" + distribution.distributionDomainName,
    });

    new BucketDeployment(this, "DeployWebsite", {
      destinationBucket: websiteBucket,
      sources: [Source.asset("../../../apps/web/build")],
    });
  }
}
