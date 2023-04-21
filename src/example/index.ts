import { Context } from 'aws-lambda';
import { LocalLambda, LocalLambdaConfig } from '../local.lambda';
import { LambdaResponse, RequestEvent } from '../types';

// handler is a function that takes in an event and context and returns a response
const handler = async (req: RequestEvent, context: Context): Promise<LambdaResponse> => ({ statusCode: 200, body: `Hello World !!! My userId is ${req.pathParameters?.id}\n` });

// context is provided as optional field in config.
const config: LocalLambdaConfig = {
  handler, // if type is not compatible, do `handler: handler as any`
  port: 8000, // optional, default to 8000
  pathParamsPattern: '/user/:id', // optional, default to '/'
};

// visit http://localhost:8080/user/1234567890 to see the response
const localLambda = new LocalLambda(config);
localLambda.run();
