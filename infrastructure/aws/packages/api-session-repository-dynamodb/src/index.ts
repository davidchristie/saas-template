import {
  CreateOneArgs,
  DeleteOneArgs,
  FindManyArgs,
  Session,
  SessionRepository,
  UpdateOneArgs,
} from "@saas/api-session-repository";
import * as aws from "aws-sdk";

export interface DynamoDBSessionRepositoryProps {
  client: aws.DynamoDB.DocumentClient;
  tableName: string;
}

export class DynamoDBSessionRepository implements SessionRepository {
  private client: aws.DynamoDB.DocumentClient;
  private tableName: string;

  public constructor({ client, tableName }: DynamoDBSessionRepositoryProps) {
    this.client = client;
    this.tableName = tableName;
  }

  public async findById(id: string): Promise<Session | null> {
    const response = await this.client
      .get({
        TableName: this.tableName,
        Key: {
          id,
        },
      })
      .promise();

    const session = (response.Item as Session) ?? null;

    return session;
  }

  public async createOne(args: CreateOneArgs): Promise<Session> {
    const currentDate = new Date().toISOString();
    const session: Session = {
      id: args.data.id,
      createdAt: currentDate,
      updatedAt: currentDate,
      deletedAt: null,
      expiresAt: args.data.expiresAt,
      userId: args.data.userId,
    };

    await this.client
      .put({
        Item: session,
        TableName: this.tableName,
      })
      .promise();

    return session;
  }

  public async findMany(args: FindManyArgs): Promise<Session[]> {
    const response = await this.client
      .scan({
        Limit: args.limit,
        TableName: this.tableName,
      })
      .promise();

    const sessions = (response.Items as Session[]) ?? [];

    return sessions;
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
    await this.updateOne({
      data: {
        deletedAt: new Date().toISOString(),
      },
      where: args.where,
    });
  }
}
