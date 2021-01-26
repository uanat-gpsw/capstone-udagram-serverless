// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'r46djc2l51'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-04e63wkd.us.auth0.com',            // Auth0 domain
  clientId: '5RkSt0SuL2EIpKv9eesnJ9fByZU2imhc',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
