import { BadRequestError, UnauthorizedError } from "@saas/api-errors";
import { Session, SessionRepository } from "@saas/api-session-repository";
import { UserRepository } from "@saas/api-user-repository";
import { compare, hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { addHours, isBefore } from "date-fns";
import { formatUser } from "./format";
import { signToken, TokenPayload, verifyToken } from "./tokens";
import {
  AuthenticateArgs,
  AuthenticationService,
  LoginArgs,
  LoginResult,
  LogoutArgs,
  SignupArgs,
  SignupResult,
  User,
} from "./types";

export * from "./types";

export interface DefaultAuthenticationServiceProps {
  jwtSecret: string;
  sessionRepository: SessionRepository;
  userRepository: UserRepository;
}

const saltRounds = 10;
const incorrectEmailOrPassword = new BadRequestError(
  "Incorrect email or password."
);
const missingAuthenticationToken = new UnauthorizedError(
  "Authentication token is missing."
);
const invalidAuthenticationToken = new UnauthorizedError(
  "Authentication token is invalid."
);
const authenticationTokenExpired = new UnauthorizedError(
  "Authentication token has expired."
);
const authenticationTokenRevoked = new UnauthorizedError(
  "Authentication token has been revoked."
);

export class DefaultAuthenticationService implements AuthenticationService {
  private jwtSecret: string;
  private sessionRepository: SessionRepository;
  private userRepository: UserRepository;

  public constructor({
    jwtSecret,
    sessionRepository,
    userRepository,
  }: DefaultAuthenticationServiceProps) {
    this.jwtSecret = jwtSecret;
    this.sessionRepository = sessionRepository;
    this.userRepository = userRepository;
  }

  public async authenticate(args: AuthenticateArgs): Promise<User> {
    if (args.token === null) {
      throw missingAuthenticationToken;
    }

    const session = await this.findSessionByToken(args.token);

    if (isBefore(new Date(session.expiresAt), new Date())) {
      throw authenticationTokenExpired;
    }

    if (session.deletedAt !== null) {
      throw authenticationTokenRevoked;
    }

    const user = await this.userRepository.findById(session.userId);

    if (user === null) {
      throw new Error("User not found: " + session.userId);
    }

    return formatUser(user);
  }

  public async login(args: LoginArgs): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(args.email);

    if (user === null) {
      throw incorrectEmailOrPassword;
    }

    const isCorrectPassword = await compare(args.password, user.password);

    if (!isCorrectPassword) {
      throw incorrectEmailOrPassword;
    }

    const session = await this.createSession(user.id);

    const token = signToken(
      {
        sessionId: session.id,
      },
      this.jwtSecret
    );

    return {
      token,
      user: formatUser(user),
    };
  }

  public async logout(args: LogoutArgs): Promise<void> {
    if (args.token === null) {
      return;
    }

    const session = await this.findSessionByToken(args.token);

    if (session !== null) {
      await this.sessionRepository.deleteOne({
        where: {
          id: session.id,
        },
      });
    }
  }

  public async signup(args: SignupArgs): Promise<SignupResult> {
    console.info(">>> signup args:", args);

    const user = await this.userRepository.createOne({
      data: {
        id: randomUUID(),
        givenName: args.givenName,
        familyName: args.familyName,
        email: args.email,
        password: await hash(args.password, saltRounds),
      },
    });

    console.info(">>> user created:", user);

    const session = await this.createSession(user.id);

    const token = signToken(
      {
        sessionId: session.id,
      },
      this.jwtSecret
    );

    console.info(">>> token generated:", token);

    return {
      token,
      user: formatUser(user),
    };
  }

  private createSession(userId: string): Promise<Session> {
    const session = this.sessionRepository.createOne({
      data: {
        id: randomUUID(),
        expiresAt: addHours(new Date(), 8).toISOString(),
        userId,
      },
    });
    console.info(">>> session created:", session);
    return session;
  }

  private async findSessionByToken(token: string): Promise<Session> {
    const tokenPayload = this.verifyToken(token);
    const session = await this.sessionRepository.findById(
      tokenPayload.sessionId
    );
    if (session === null) {
      throw invalidAuthenticationToken;
    }
    return session;
  }

  private verifyToken(token: string): TokenPayload {
    try {
      return verifyToken(token, this.jwtSecret);
    } catch (error) {
      throw invalidAuthenticationToken;
    }
  }
}
