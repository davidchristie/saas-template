import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log("Event:", event);
  console.log("Context:", context);

  const authorizationHeader = event.headers["Authorization"];

  if (typeof authorizationHeader === "string") {
    return {
      statusCode: 200,
      headers: {},
      body: JSON.stringify({
        data: {
          email: "john.doe@email.com",
          familyName: "Doe",
          givenName: "John",
        },
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({
      data: null,
    }),
  };
};
