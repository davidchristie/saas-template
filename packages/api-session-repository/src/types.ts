export interface Session {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  expiresAt: string;
  userId: string;
}

export interface CreateOneArgs {
  data: Omit<Session, "createdAt" | "updatedAt" | "deletedAt">;
}

export interface DeleteOneArgs {
  where: Pick<Session, "id">;
}

export interface FindManyArgs {
  cursor?: string;
  limit: number;
}

export interface UpdateOneArgs {
  data: Partial<Omit<Session, "id" | "createdAt" | "updatedAt">>;
  where: Pick<Session, "id">;
}

export interface SessionRepository {
  createOne(args: CreateOneArgs): Promise<Session>;
  findById(id: string): Promise<Session | null>;
  findMany(args: FindManyArgs): Promise<Session[]>;
  updateOne(args: UpdateOneArgs): Promise<void>;
  deleteOne(args: DeleteOneArgs): Promise<void>;
}
