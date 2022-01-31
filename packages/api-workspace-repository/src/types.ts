export interface Workspace {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
}

export interface CreateOneArgs {
  data: Omit<Workspace, "createdAt" | "updatedAt">;
}

export interface DeleteOneArgs {
  where: Pick<Workspace, "id">;
}

export interface FindOneArgs {
  where: Pick<Workspace, "id">;
}

export interface FindManyArgs {
  cursor?: string;
  limit: number;
}

export interface UpdateOneArgs {
  data: Partial<Omit<Workspace, "id" | "createdAt" | "updatedAt">>;
  where: Pick<Workspace, "id">;
}

export interface WorkspaceRepository {
  createOne(args: CreateOneArgs): Promise<Workspace>;
  findOne(args: FindOneArgs): Promise<Workspace | null>;
  findMany(args: FindManyArgs): Promise<Workspace[]>;
  updateOne(args: UpdateOneArgs): Promise<void>;
  deleteOne(args: DeleteOneArgs): Promise<void>;
}
