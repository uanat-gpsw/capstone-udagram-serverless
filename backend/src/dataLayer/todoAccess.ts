import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { String } from 'aws-sdk/clients/batch'
import { createLogger } from '../utils/logger'

const bucketName = process.env.TODO_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('dataLayer')




const XAWS = AWSXRay.captureAWS(AWS)
const todoIdIndex = process.env.TODO_ID_INDEX
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODO_TABLE) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todos')
    
    const result = await this.docClient.query({
      TableName : this.todoTable,
      IndexName : todoIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
  }).promise()
    const items = result.Items
    return items as TodoItem[]
  }


  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info('creating todo')
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()

    return todo
  }
  
  async deleteTodo(todoId: String,userId : String): Promise<boolean> {
    logger.info('Deleting todo')
    await this.docClient.delete(
    {TableName: this.todoTable,
    Key:{"todoId": todoId, "userId": userId}}).promise()
    return true
  }


  async generateUploadUrl(todoId: string,userId: string): Promise<string> {
    logger.info('generateUploadUrl')
    const url = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })
    await this.docClient.update(
      {
      TableName: this.todoTable,
      Key:{"todoId": todoId, "userId": userId},
      UpdateExpression: "set attachmentUrl = :url",
      ExpressionAttributeValues:{
          ":url":`https://${bucketName}.s3.amazonaws.com/${todoId}`

      },
      ReturnValues:"UPDATED_NEW"
      }).promise()
      return url
  }

  async updateTodo(todo: TodoUpdate,todoId: string, userId: string): Promise<boolean> {
    logger.info('Updating todo')
    await this.docClient.update(
    {
    TableName: this.todoTable,
    Key:{"todoId": todoId,"userId":userId},
    UpdateExpression: "set #n = :n, dueDate=:du, done=:do",

    ExpressionAttributeValues:{
        ":n":todo.name,
        ":du":todo.dueDate,
        ":do":todo.done
    },
    ExpressionAttributeNames:{
      "#n": "name"
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
