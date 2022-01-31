import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerHandler,
} from "aws-lambda";

export const handler: APIGatewayRequestAuthorizerHandler = async (
  event,
  context
) => {
  console.log("Event:", JSON.stringify(event, null, 2));
  console.log("Context:", JSON.stringify(context, null, 2));

  return generatePolicy("user", "Allow", event.methodArn);
  // if (
  //   event.headers?["Authorization"] &&
  //   event.headers["Authorization"] !== "fail"
  // ) {
  //   return generatePolicy("user", "Allow", event.methodArn);
  // } else {
  //   return generatePolicy("user", "Deny", event.methodArn);
  // }
};

// Help function to generate an IAM policy
const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string
): APIGatewayAuthorizerResult => {
  var authResponse: any = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument: any = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne: any = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Example of Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    stringKey: "stringval",
    numberKey: 123,
    booleanKey: true,
  };
  return authResponse;
};
