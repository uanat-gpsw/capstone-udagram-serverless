import 'source-map-support/register'

import {APIGatewayProxyEvent,APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { User } from '../../models/User'

import { getAllUsers } from '../../businessLogic/user'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const users: User[] = await getAllUsers(jwtToken)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: users
    })
  }

}
