import { Context } from 'aws-lambda';

export interface RequestEvent {
  requestContext?: any;
  httpMethod?: string;
  method?: string;
  path?: string;
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
