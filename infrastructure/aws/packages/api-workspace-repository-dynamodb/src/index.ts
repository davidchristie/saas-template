import {
  CreateOneArgs,
  DeleteOneArgs,
  FindManyArgs,
  FindOneArgs,
  UpdateOneArgs,
  Workspace,
  WorkspaceRepository,
} from "@saas/api-workspace-repository";
import * as aws from "aws-sdk";

export interface DynamoDBWorkspaceRepositoryProps {
  client: aws.DynamoDB.DocumentClient;
  tableName: string;
}

export class DynamoDBWorkspaceRepository implements WorkspaceRepository {
  private client: aws.DynamoDB.DocumentClient;
  private tableName: string;

  public constructor({ client, tableName }: DynamoDBWorkspaceRepositoryProps) {
    this.client = client;
    this.tableName = tableName;
  }

  public async createOne(args: CreateOneArgs): Promise<Workspace> {
    const currentDate = new Date();
    const workspace: Workspace = {
      id: args.data.id,
      createdAt: currentDate,
      updatedAt: currentDate,
      name: args.data.name,
    };

    await this.client
      .put({
        Item: workspace,
        TableName: this.tableName,
      })
      .promise();

    return workspace;
  }

  public async findOne(args: FindOneArgs): Promise<Workspace | null> {
    const response = await this.client
      .get({
        TableName: this.tableName,
        Key: {
          id: args.where.id,
        },
      })
      .promise();

    const workspace = (response.Item as Workspace) ?? null;

    return workspace;
  }

  public async findMany(args: FindManyArgs): Promise<Workspace[]> {
    const response = await this.client
      .scan({
        Limit: args.limit,
        TableName: this.tableName,
      })
      .promise();

    const workspaces = (response.Items as Workspace[]) ?? [];

    return workspaces;
  }

  public async updateOne(args: UpdateOneArgs): Promise<void> {
    const updatedProperties = {
      ...args.data,
      updatedAt: new Date(),
    };
    const expressionAttributeValues = Object.fromEntries(
      Object.entries(updatedProperties).map((key, value) => [":" + key, value])
    );
    const updateExpression =
      "set " +
      Object.keys(updatedProperties)
        .map((key) => `${key} = :${key}`)
        .join(",");

    await this.client
      .update({
        ConditionExpression: "attribute_exists(id)",
        ExpressionAttributeValues: expressionAttributeValues,
        Key: {
          id: args.where.id,
        },
        UpdateExpression: updateExpression,
        TableName: this.tableName,
      })
      .promise();
  }

  public async deleteOne(args: DeleteOneArgs): Promise<void> {
    await this.client
      .delete({
        TableName: this.tableName,
        Key: {
          id: args.where.id,
        },
      })
      .promise();
  }
}
