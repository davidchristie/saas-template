import { SignupResult } from "@saas/api-authentication-service";
import { Status } from "@saas/http";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { createHandler } from "./handler";

const email = "john.doe@email.com";
const familyName = "Doe";
const givenName = "John";
const password = "pa$$word123";
const userId = "<USER_ID>";
const signupResult: SignupResult = {
  token: "<TOKEN>",
  user: {
    createdAt: "<CREATED_AT>",
    email,
    familyName,
    givenName,
    id: userId,
    updatedAt: "<UPDATED_AT>",
  },
};

describe("createHandler()", () => {
  const authenticationService = {
    authenticate: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    signup: jest.fn(),
  };
  const workspaceService = {
    createWorkspace: jest.fn(),
    getWorkspace: jest.fn(),
    getWorkspaces: jest.fn(),
    deleteWorkspace: jest.fn(),
    updateWorkspace: jest.fn(),
  };
  const handler = createHandler({
    authenticationService,
    workspaceService,
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("POST /api/v1/signup", async () => {
    const event: APIGatewayProxyEvent = {
      path: "/api/v1/signup",
      httpMethod: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        familyName,
        givenName,
        password,
      }),
    } as unknown as APIGatewayProxyEvent;
    const context = {} as Context;
    authenticationService.signup.mockResolvedValueOnce(signupResult);
    const result = await handler(event, context);
    expect(authenticationService.signup).toBeCalledTimes(1);
    expect(authenticationService.signup).toBeCalledWith({
      email,
      familyName,
      givenName,
      password,
    });
    expect(result).toMatchObject({
      body: JSON.stringify(signupResult),
      headers: {
        "content-length": "166",
        "content-type": "application/json; charset=utf-8",
        "correlation-id": expect.any(String),
        etag: expect.any(String),
        "x-powered-by": "Express",
      },
      isBase64Encoded: false,
      statusCode: Status.OK,
    });
  });
});
