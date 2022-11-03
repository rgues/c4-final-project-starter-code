import * as AWS from 'aws-sdk'
import { TodoItem } from '../models/TodoItem'

// TODO: Implement the dataLayer logic
export class TodoAccess {

  constructor(
    private readonly docClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODOS_TABLE) {
  }

  // Get all items
  async getAllTodos(userId: string): Promise<TodoItem[]> {

    const result = await this.docClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  // Create an item
  async createTodo(todo: TodoItem): Promise<TodoItem> {

    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()

    return todo
  }

  // Update an item
  async updateTodo(userId: string, todoId: string, todoItemUpdate: TodoItem): Promise<TodoItem> {

    const result = await this.docClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      },
      ScanIndexForward: false
    }).promise()

    const userItem = result.Items[0];

    const newItem: TodoItem = {
      ...userItem,
      ...todoItemUpdate,
      userId
    }

    await this.docClient.put({
      TableName: this.todoTable,
      Item: newItem
    }).promise()

    return newItem
  }

  // Delete an item
  async deleteTodo(todoId: string, userId: string): Promise<string> {

    const key = {
      todoId: todoId
    };

    await this.docClient.delete({
      TableName: this.todoTable,
      Key: key
    }).promise()

    return userId;
  }
}
