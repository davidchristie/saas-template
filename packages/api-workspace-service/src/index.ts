import { WorkspaceRepository } from "@saas/api-workspace-repository";
import { v4 as uuid } from "uuid";
import {
  CreateWorkspaceArgs,
  DeleteWorkspaceArgs,
  GetWorkspaceArgs,
  GetWorkspacesArgs,
  UpdateWorkspaceArgs,
  Workspace,
  WorkspaceService,
} from "./types";

export interface WorkspaceServiceProps {
  workspaceRepository: WorkspaceRepository;
}

export class DefaultWorkspaceService implements WorkspaceService {
  private workspaceRepository: WorkspaceRepository;

  public constructor({ workspaceRepository }: WorkspaceServiceProps) {
    this.workspaceRepository = workspaceRepository;
  }

  public deleteWorkspace(args: DeleteWorkspaceArgs): Promise<void> {
    return this.workspaceRepository.deleteOne({
      where: {
        id: args.id,
      },
    });
  }

  public createWorkspace(args: CreateWorkspaceArgs): Promise<Workspace> {
    return this.workspaceRepository.createOne({
      data: {
        id: uuid(),
        name: args.name,
      },
    });
  }

  public getWorkspace(args: GetWorkspaceArgs): Promise<Workspace | null> {
    return this.workspaceRepository.findOne({
      where: {
        id: args.id,
      },
    });
  }

  public getWorkspaces(args: GetWorkspacesArgs): Promise<Workspace[]> {
    return this.workspaceRepository.findMany({
      limit: args.limit ?? 100,
    });
  }

  public updateWorkspace(args: UpdateWorkspaceArgs): Promise<void> {
    return this.workspaceRepository.updateOne({
      data: {
        name: args.name,
      },
      where: {
        id: args.id,
      },
    });
  }
}
