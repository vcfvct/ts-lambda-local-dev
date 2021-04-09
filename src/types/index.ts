import { Context } from 'aws-lambda';
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import { HTTPMethod } from 'http-method-enum';

export interface RequestEvent {
  requestContext?: any;
  httpMethod?: HTTPMethod;
  method?: string;
  path: string;
  headers?: IncomingHttpHeaders;
  body?: string;
  isBase64Encoded?: boolean;
}

export interface LambdaResponse {
  statusCode: number;
  headers?: OutgoingHttpHeaders;
  isBase64Encoded?: boolean;
  body?: any;
}

export type LambdaHandler = (req: RequestEvent, context: Context) => Promise<LambdaResponse>;
