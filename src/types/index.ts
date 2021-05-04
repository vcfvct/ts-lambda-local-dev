import { Context } from 'aws-lambda';
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import { HTTPMethod } from 'http-method-enum';
import { ParsedUrlQuery } from 'querystring';

export interface RequestEvent {
  requestContext?: any;
  httpMethod?: HTTPMethod;
  method?: string;
  path: string;
  headers?: IncomingHttpHeaders;
  body?: string;
  queryStringParameters?: ParsedUrlQuery;
  isBase64Encoded?: boolean;
}

export interface LambdaResponse {
  statusCode: number;
  headers?: OutgoingHttpHeaders;
  isBase64Encoded?: boolean;
  body?: any;
}

export type LambdaHandler = (req: RequestEvent, context: Context) => Promise<LambdaResponse>;
