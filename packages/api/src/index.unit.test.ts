import { SignupResult } from "@saas/api-authentication-service";
import { Status } from "@saas/http";
import { Express } from "express";
import request from "supertest";
import { createExpressApp } from ".";

const email = "john.doe@email.com";
const familyName = "Doe";
const givenName = "John";
const password = "pa$$word123";
const userId = "<USER_ID>";

describe("createExpressApp()", () => {
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

  let app: Express;

  beforeEach(() => {
    app = createExpressApp({
      authenticationService,
      workspaceService,
    });
  });

  test("POST /api/v1/signup", async () => {
    const body = {
      givenName,
      familyName,
      email,
      password,
    };
    const result: SignupResult = {
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
    authenticationService.signup.mockResolvedValueOnce(result);
    const response = await request(app).post("/api/v1/signup").send(body);
    expect(authenticationService.signup).toBeCalledTimes(1);
    expect(authenticationService.signup).toBeCalledWith(body);
    expect(response.status).toBe(Status.OK);
    expect(response.body).toEqual(result);
  });
});
