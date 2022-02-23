import {
  CreateOneArgs,
  DeleteOneArgs,
  FindManyArgs,
  UpdateOneArgs,
  User,
  UserRepository,
} from "@saas/api-user-repository";
import * as aws from "aws-sdk";

export interface DynamoDBUserRepositoryProps {
  client: aws.DynamoDB.DocumentClient;
  tableName: string;
}

export class DynamoDBUserRepository implements UserRepository {
  private client: aws.DynamoDB.DocumentClient;
  private tableName: string;

  public constructor({ client, tableName }: DynamoDBUserRepositoryProps) {
    this.client = client;
    this.tableName = tableName;
  }

  public async createOne(args: CreateOneArgs): Promise<User> {
    const currentDate = new Date().toISOString();
    const user: User = {
      id: args.data.id,
      createdAt: currentDate,
      updatedAt: currentDate,
      deletedAt: null,
      givenName: args.data.givenName,
      familyName: args.data.familyName,
      email: args.data.email,
      password: args.data.password,
    };

    await this.client
      .put({
        Item: user,
        TableName: this.tableName,
      })
      .promise();

    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const response = await this.client
      .scan({
        ExpressionAttributeValues: {
          ":email": {
            S: email,
          },
        },
        FilterExpression: "email = :email",
        Limit: 1,
        TableName: this.tableName,
      })
      .promise();

    const users = (response.Items as User[]) ?? [];

    return users[0] ?? null;
  }

  public async findById(id: string): Promise<User | null> {
    const response = await this.client
      .get({
        TableName: this.tableName,
        Key: {
          id,
        },
      })
      .promise();

    const user = (response.Item as User) ?? null;

    return user;
  }

  public async findMany(args: FindManyArgs): Promise<User[]> {
    const response = await this.client
      .scan({
        Limit: args.limit,
        TableName: this.tableName,
      })
      .promise();

    const users = (response.Items as User[]) ?? [];

    return users;
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
