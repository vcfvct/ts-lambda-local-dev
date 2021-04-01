import { Context } from 'aws-lambda';
import { HTTPMethod } from 'http-method-enum';

export interface RequestEvent {
  requestContext?: any;
  httpMethod?: HTTPMethod;
  method?: string;
  path: string;
  headers?: HttpHeaders;
  body?: string;
  isBase64Encoded?: boolean;
}

export type HttpHeaders = { [key: string]: string | string[] };

export interface LambdaResponse {
  statusCode: number;
  headers?: HttpHeaders;
  isBase64Encoded?: boolean;
  body?: any;
}

export type LambdaHandler = (req: RequestEvent, context?: Context) => Promise<LambdaResponse>;
