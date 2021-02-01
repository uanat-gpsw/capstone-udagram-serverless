import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Follow } from '../models/Follow'
import { createLogger } from '../utils/logger'

const logger = createLogger('dataLayer')
const followIdIndex = process.env.FOLLOW_ID_INDEX

const XAWS = AWSXRay.captureAWS(AWS)
export class FollowAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly followTable = process.env.FOLLOW_TABLE) {
  }

  async getAllFollow(userId: string): Promise<Follow[]> {
    logger.info('Getting all followers')
    const result = await this.docClient.query({
      TableName : this.followTable,
      IndexName : followIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
  }).promise()
    const followers = result.Items
    return followers as Follow[]
  }


  async createFollow(follower: Follow): Promise<Follow> {
    
    logger.info('creating follower')
    await this.docClient.put({
      TableName: this.followTable,
      Item: follower
    },
    ).promise()
    return follower
  }


  async deleteFollow(followId: String,userId : String): Promise<boolean> {
    logger.info('Deleting follower')
    await this.docClient.delete(
    {TableName: this.followTable,
    Key:{"userId": userId, "followId": followId}}).promise()
    return true
  }




}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
