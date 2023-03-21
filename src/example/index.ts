import { Context } from 'aws-lambda';
import { LocalLambda, LocalLambdaConfig } from '../local.lambda';
import { LambdaResponse, RequestEvent } from '../types';

// handler is a function that takes in an event and context and returns a response
const handler = async (req: RequestEvent, context: Context): Promise<LambdaResponse> => ({ statusCode: 200, body: 'Hello World' });

// context is provided as optional field in config.
const config: LocalLambdaConfig = {
  handler, // if type is not compatible, do `handler: handler as any`
  port: 8000, // optional, default to 8000
};

const localLambda = new LocalLambda(config);
localLambda.run();
