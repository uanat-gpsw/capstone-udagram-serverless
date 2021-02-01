import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'
import { getAllFollow } from './follow'

const logger = createLogger('businessLogic')
const todoAccess = new TodoAccess()
export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  logger.info("Calling getAllTodos")
  const userId = parseUserId(jwtToken)
  return todoAccess.getAllTodos(userId)
}


export async function getFollowingTodos(jwtToken: string): Promise<TodoItem[]> {
  logger.info("Calling getAllFollowers")
  const follow = await getAllFollow(jwtToken)
  const followers = follow.map(function(item) {
    return item['followId'];
  });
  if(followers.length != 0)
  return todoAccess.getFollowingTodos(followers)
  else 
  return []
}


export async function createTodo(
    CreateTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)
  logger.info("Calling createTodo")
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
  logger.info("Calling deleteTodo")
  return await todoAccess.deleteTodo(todoId,userId)
}

export async function generateUploadUrl(
    todoId: string, jwtToken: string
 ): Promise<string> {
    const userId = parseUserId(jwtToken)
    logger.info("Calling generateUploadUrl")
   return await todoAccess.generateUploadUrl(todoId,userId)
 }

export async function updateTodo(
    UpdateTodoRequest: UpdateTodoRequest,todoId : string, jwtToken :string
 ): Promise<boolean> {
   const userId = parseUserId(jwtToken)
   logger.info("Calling updateTodo")
   return await todoAccess.updateTodo(UpdateTodoRequest,todoId,userId)
 }


