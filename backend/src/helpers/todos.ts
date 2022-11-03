import { TodoAccess } from '../helpers/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { todoExists, getUploadUrl } from './attachmentUtils'

// TODO: Implement businessLogic
const todosAccess = new TodoAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  return todosAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const itemId = uuid.v4();
  
  return await todosAccess.createTodo({
    userId: userId,
    todoId: itemId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: createTodoRequest.createdAt,
    done: createTodoRequest.done,
    attachmentUrl: createTodoRequest.attachmentUrl
  });

}

export async function updateTodo(
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const newItem = {
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  }

  return await todosAccess.updateTodo(userId, todoId,
    {
      userId,
      todoId,
      ...newItem,
      createdAt: new Date().toISOString()
    });
}

export async function deleteTodo(todoId: string, userId: string) {
  return await todosAccess.deleteTodo(todoId, userId);
}

export async function createAttachmentPresignedUrl(todoId: string) {

  const validTodoId = await todoExists(todoId)

  if (!validTodoId) {
    return {
      statusCode: 404,
      body: ''
    }
  }

 return getUploadUrl(todoId)
}