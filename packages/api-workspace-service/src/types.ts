export interface Workspace {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface CreateWorkspaceArgs {
  name: string;
}

export interface DeleteWorkspaceArgs {
  id: string;
}

export interface GetWorkspaceArgs {
  id: string;
}

export interface GetWorkspacesArgs {
  limit?: number;
}

export interface UpdateWorkspaceArgs {
  id: string;
  name?: string;
}

export interface WorkspaceService {
  createWorkspace(args: CreateWorkspaceArgs): Promise<Workspace>;
  getWorkspace(args: GetWorkspaceArgs): Promise<Workspace | null>;
  getWorkspaces(args: GetWorkspacesArgs): Promise<Workspace[]>;
  deleteWorkspace(args: DeleteWorkspaceArgs): Promise<void>;
  updateWorkspace(args: UpdateWorkspaceArgs): Promise<void>;
}
