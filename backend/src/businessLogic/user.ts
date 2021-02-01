
import { User } from '../models/User'
import { UserAccess } from '../dataLayer/UserAccess'
import { UpdateUserRequest } from '../requests/UpdateUserRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'
import { getAllFollow } from './follow'

const logger = createLogger('businessLogic')
const userAccess = new UserAccess()
export async function getAllUsers(jwtToken:string): Promise<User[]> {
  logger.info("Calling getAllUsers")
  const userId = parseUserId(jwtToken)
  const follow = await getAllFollow(jwtToken)

  const followers = follow.map(function(item) {
    return item['followId'];
  });
  logger.info(followers)
  return userAccess.getAllUsers(userId,followers)
}

export async function getUser(jwtToken: string): Promise<User> {
  logger.info("Calling getUser")
  const userId = parseUserId(jwtToken)
  return userAccess.getUser(userId)
}

export async function createUser(
  jwtToken :string
): Promise<User> {
  logger.info("Calling createUser")
  const userId = parseUserId(jwtToken)
  return await userAccess.createUser({
    userId: userId
    })
}


export async function updateUser(
    UpdateUserRequest: UpdateUserRequest, jwtToken :string
 ): Promise<boolean> {
   const userId = parseUserId(jwtToken)
   logger.info("Calling updateUser")
   return await userAccess.updateUser(
     {
      firstName: UpdateUserRequest.firstName,
      lastName : UpdateUserRequest.lastName,
      emailId : UpdateUserRequest.emailId
  },userId)
 }


