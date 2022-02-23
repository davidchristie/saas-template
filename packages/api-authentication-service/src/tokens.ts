import { sign, verify } from "jsonwebtoken";
import { Record, Static, String } from "runtypes";

const TokenPayloadRecord = Record({
  sessionId: String,
});

export type TokenPayload = Static<typeof TokenPayloadRecord>;

export function signToken(payload: TokenPayload, secret: string): string {
  return sign(payload, secret);
}

export function verifyToken(token: string, secret: string): TokenPayload {
  const payload = verify(token, secret);

  if (TokenPayloadRecord.guard(payload)) {
    return payload;
  }

  throw new Error("Invalid token payload: " + payload);
}
