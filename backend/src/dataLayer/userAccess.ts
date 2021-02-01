import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { User } from '../models/User'
import { UserUpdate } from '../models/UserUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('dataLayer')


const XAWS = AWSXRay.captureAWS(AWS)
export class UserAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly userTable = process.env.USER_TABLE) {
  }

  async getAllUsers(userId:string,followers: string[]): Promise<User[]> {
    logger.info('Getting all users')

    var followObj = {":userId":userId};
    var index = 0;
    followers.forEach(function(value) {
        index++;
        var titleKey = ":titlevalue"+index;
        followObj[titleKey.toString()] = value;
    });


    const result = await this.docClient.scan({
      TableName : this.userTable,
      FilterExpression: "NOT(userId IN ("+Object.keys(followObj).toString()+ ")) AND NOT (userId = :userId)",
      ExpressionAttributeValues: followObj
  }).promise()
    const users = result.Items
    return users as User[]
  }

  async getUser(userId: string): Promise<User> {
    logger.info('Getting  user')
    const result = await this.docClient.get({
      TableName : this.userTable,
      Key : {"userId" : userId}
  }).promise()
    const user = result.Item
    return user as User
  }


  async createUser(user: User): Promise<User> {
    
    logger.info('creating user')
    await this.docClient.put({
      TableName: this.userTable,
      Item: user
    },
    ).promise()
    return user
  }
  
  async updateUser(user: UserUpdate,userId: string): Promise<boolean> {
    logger.info('Updating User')
    await this.docClient.update(
    {
    TableName: this.userTable,
    Key:{"userId":userId},
    UpdateExpression: "set firstName = :fn, lastName=:ln, emailId=:eid",
    ExpressionAttributeValues:{
        ":fn":user.firstName,
        ":ln":user.lastName,
        ":eid":user.emailId
    },
    ReturnValues:"UPDATED_NEW"
    }).promise()
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
