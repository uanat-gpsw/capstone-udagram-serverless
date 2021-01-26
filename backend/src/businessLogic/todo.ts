import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()
export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
   const userId = parseUserId(jwtToken)
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(
    CreateTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: CreateTodoRequest.name,
    dueDate: CreateTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done : false,
  })
}


export async function deleteTodo(
   todoId: string,jwtToken : string
): Promise<boolean> {
  const userId = parseUserId(jwtToken)
  return await todoAccess.deleteTodo(todoId,userId)
}

export async function generateUploadUrl(
    todoId: string, jwtToken: string
 ): Promise<string> {
    const userId = parseUserId(jwtToken)
   return await todoAccess.generateUploadUrl(todoId,userId)
 }

export async function updateTodo(
    UpdateTodoRequest: UpdateTodoRequest,todoId : string, jwtToken :string
 ): Promise<boolean> {
   const userId = parseUserId(jwtToken)
   return await todoAccess.updateTodo(UpdateTodoRequest,todoId,userId)
 }


