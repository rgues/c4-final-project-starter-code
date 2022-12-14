import * as AWS from 'aws-sdk'
import { TodoItem } from '../../models/TodoItem'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

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
  async updateTodo(userId: string, todoId: string, todoItemUpdate: UpdateTodoRequest): Promise<string> {

    await this.docClient.update({
      TableName: this.todoTable,
      Key: {
        userId,
        todoId
      },
   UpdateExpression: "set #name = :val1, #dueDate = :val2, #done = :val3",
   ConditionExpression: "todoId = :todoId",
   ExpressionAttributeNames: { 
    '#name' : 'name',
    '#dueDate' : 'dueDate',
    '#done' : 'done'
  },
   ExpressionAttributeValues: { 
    ':val1' : todoItemUpdate.name,
    ':val2' : todoItemUpdate.dueDate,
    ':val3' : todoItemUpdate.done,
    ':todoId' : todoId  
  },
      ReturnValues: "ALL_NEW"
    }).promise()

    return ''
  }

  // Delete an item
  async deleteTodo(todoId: string, userId: string): Promise<string> {

    const key = {
      todoId: todoId,
      userId: userId
    };

    await this.docClient.delete({
      TableName: this.todoTable,
      Key: key
    }).promise()

    return '';
  }


// check if todoItem exist
 async  todoExists(todoId: string, userId: string) {
  const result = await this.docClient
      .get({
          TableName: this.todoTable,
          Key: {
              todoId: todoId,
              userId: userId
          }
      })
      .promise()
  console.log('Get todo: ', result)
  return !!result.Item
}
}
