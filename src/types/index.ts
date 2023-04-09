import { Context } from 'aws-lambda';
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import { HTTPMethod } from 'http-method-enum';

export interface RequestEvent {
  requestContext?: any;
  httpMethod?: HTTPMethod;
  method?: string;
  path: string;
  headers?: IncomingHttpHeaders;
  multiValueHeaders?: { [name: string]: string[] };
  body?: string;
  queryStringParameters?: Record<string, string>;
  multiValueQueryStringParameters?: { [name: string]: string[] };
  isBase64Encoded?: boolean;
  pathParameters?: Record<string, string>;
}

export interface LambdaResponse {
  statusCode: number;
  statusDescription?: string;
  headers?: OutgoingHttpHeaders;
  multiValueHeaders?: { [name: string]: string[] };
  isBase64Encoded?: boolean;
  body?: any;
}

export type LambdaHandler = (req: RequestEvent, context: Context) => Promise<LambdaResponse>;
