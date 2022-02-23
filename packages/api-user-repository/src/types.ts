export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  givenName: string;
  familyName: string;
  email: string;
  password: string;
}

export interface CreateOneArgs {
  data: Omit<User, "createdAt" | "updatedAt" | "deletedAt">;
}

export interface DeleteOneArgs {
  where: Pick<User, "id">;
}

export interface FindManyArgs {
  cursor?: string;
  limit: number;
}

export interface UpdateOneArgs {
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;
  where: Pick<User, "id">;
}

export interface UserRepository {
  createOne(args: CreateOneArgs): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findMany(args: FindManyArgs): Promise<User[]>;
  updateOne(args: UpdateOneArgs): Promise<void>;
  deleteOne(args: DeleteOneArgs): Promise<void>;
}
