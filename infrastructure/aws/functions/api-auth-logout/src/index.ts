import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log("Event:", event);
  console.log("Context:", context);

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({}),
  };
};
