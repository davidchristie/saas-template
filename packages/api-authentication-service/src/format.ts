import { User as RepositoryUser } from "@saas/api-user-repository";
import { User } from "./types";

export function formatUser(user: RepositoryUser): User {
  return {
    createdAt: user.createdAt,
    email: user.email,
    familyName: user.familyName,
    givenName: user.givenName,
    id: user.id,
    updatedAt: user.updatedAt,
  };
}
