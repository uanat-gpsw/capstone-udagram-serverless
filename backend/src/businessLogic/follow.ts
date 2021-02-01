
import { Follow } from '../models/Follow'
import { FollowAccess } from '../dataLayer/followAccess'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'
import { FollowRequest } from '../requests/FollowRequest'

const logger = createLogger('businessLogic')
const followAccess = new FollowAccess()
export async function getAllFollow(jwtToken: string): Promise<Follow[]> {
  logger.info("Calling getAllFollow")
  const userId = parseUserId(jwtToken)
  return followAccess.getAllFollow(userId)
}

export async function createFollow(
  newFollow: Follow,jwtToken : string
): Promise<Follow> {
  const userId = parseUserId(jwtToken)
  logger.info("Calling createFollow")
  return await followAccess.createFollow({
    "followId": newFollow.followId,
    "userId":userId
  }
    )
}

export async function deleteFollow(
  newFollow: FollowRequest,jwtToken : string
): Promise<boolean> {
  const userId = parseUserId(jwtToken)
  logger.info("Calling deleteFollow")
  return await followAccess.deleteFollow(newFollow.followId,userId)
}


