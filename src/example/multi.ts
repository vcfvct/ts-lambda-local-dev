import { Context } from 'aws-lambda';
import { LambdaResponse, RequestEvent } from '../types';
import { LambdaConfig, LocalLambdaGroupConfig, LocalLambdaGroup } from '../lambda.group';

// handler is a function that takes in an event and context and returns a response
const handler = async (req: RequestEvent, context: Context): Promise<LambdaResponse> => ({ statusCode: 200, body: `Hello World !!! My userId is ${req.pathParameters?.id}\n My JWT is ${JSON.stringify(req.requestContext.authorizer.lambda.jwt)}. My queryStringParameter is ${JSON.stringify(req.queryStringParameters)} ` });
const funnyHandler = async (req: RequestEvent, context: Context): Promise<LambdaResponse> => ({ statusCode: 200, body: `Hello World !!! I'm funny and my userId is ${req.pathParameters?.id}\n My JWT is ${JSON.stringify(req.requestContext.authorizer.lambda.jwt)}. My queryStringParameter is ${JSON.stringify(req.queryStringParameters)} ` });

// context is provided as optional field in config.
const config: LambdaConfig[] = [
  {
    handler: handler, // if type is not compatible, do `handler: handler as any`
    requestContext: {
      authorizer: {
        lambda: {
          jwt: {
            claims: {
              sub: '1234567890',
              name: 'John Doe',
              iat: 1516239022,
            },
            scopes: ['read', 'write'],
          },
        },
      },
    },
    pathParamsPattern: '/user/:id', // optional, default to '/'
  },
  {
    handler: funnyHandler, // if type is not compatible, do `handler: handler as any`
    pathParamsPattern: '/user/:id/funny', // optional, default to '/'
    requestContext: {
      authorizer: {
        lambda: {
          jwt: {
            claims: {
              sub: '1234567890',
              name: 'John Doe',
              iat: 1516239022,
            },
            scopes: ['read', 'write'],
          },
        },
      },
    },
  },
];

const multiConfig: LocalLambdaGroupConfig = {
  lambdas: config,
  port: 8008, // optional, default to 8000
  defaultPath: '/api/v1', // optional, default to '/'
};

// visit http://localhost:8008/api/v1/user/1234567890 and http://localhost:8008/api/v1/user/1234567890/funny to see the response
const localLambdaGroup = new LocalLambdaGroup(multiConfig);
localLambdaGroup.run();