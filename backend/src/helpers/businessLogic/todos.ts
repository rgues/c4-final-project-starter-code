import { TodoAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../../models/TodoItem'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { getUploadUrl } from '../fileStorage/attachmentUtils'


// TODO: Implement businessLogic
const todosAccess = new TodoAccess()
const bucketName = process.env.ATTACHMENT_S3_BUCKET

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  return todosAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const todoId = uuid.v4();
  
  return await todosAccess.createTodo({
    userId: userId,
    todoId: todoId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  });

}

export async function updateTodoData(todoId: string,updateTodoRequest: UpdateTodoRequest,userId: string): Promise<string> {

    return await todosAccess.updateTodo(userId,todoId,updateTodoRequest)
}

export async function deleteTodo(todoId: string, userId: string) {

  return await todosAccess.deleteTodo(todoId, userId);
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string) {

 const validTodoId = await todosAccess.todoExists(todoId,userId)

  if (!validTodoId) {
    return {
      statusCode: 404,
      body: ''
    }
  }

 return await getUploadUrl(todoId)
}
