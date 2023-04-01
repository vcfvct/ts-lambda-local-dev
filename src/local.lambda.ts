import { Context } from 'aws-lambda';
import * as url from 'url';
import HTTPMethod from 'http-method-enum';
import { LambdaHandler, RequestEvent } from './types';
import express, { Request, Response } from 'express';
import { flattenArraysInJSON } from './utils';
import _ from 'lodash';
const DefaultPort = 8000;

// binary upload content-type headers
const defaultBinaryContentTypeHeaders = [
  'application/octet-stream',
  'image/png',
  'image/jpeg',
  'image/gif',
  'application/pdf',
  'application/zip',
];

const DefaultPathParamsPattern = '/';

export class LocalLambda {
  handler: LambdaHandler;
  port: number;
  context: Context;
  enableCORS: boolean;
  binaryContentTypesOverride: Set<string>;
  pathParamsPattern: string;
  app: express.Application;
  requestContext: Record<string, any>;

  constructor(config: LocalLambdaConfig) {
    this.handler = config.handler;
    this.port = config.port ?? DefaultPort;
    this.context = config.context || {} as Context;
    this.enableCORS = config.enableCORS ?? true;
    this.binaryContentTypesOverride = new Set(config.binaryContentTypesOverride ?? defaultBinaryContentTypeHeaders);
    this.pathParamsPattern = config.pathParamsPattern ?? DefaultPathParamsPattern;
    this.app = express();
    this.requestContext = config.requestContext ?? {};
  }

  run(): void {
    this.app.all(`${this.pathParamsPattern}*`,async (request: Request, response: Response) => {
      // create a copy of requestContext to avoid accidental mutation
      const copyOfRequestContext = _.cloneDeep(this.requestContext);
      const data: Buffer[] = [];
      const parsedUrl = url.parse(request.url!, true);

      request.on('data', chunk => {
        data.push(chunk);
      });
      request.on('end', async () => {
        if (this.enableCORS && request.method === 'OPTIONS') {
          this.setCORSHeaders(response);
          response.writeHead(200);
          response.end();
          return; // for complex requests(POST etc)' CORS header
        }
        const contentType = request.headers['content-type'];
        const isBinaryUpload = this.binaryContentTypesOverride.has(contentType as string);
        const body = Buffer.concat(data);
        const req: RequestEvent = {
          path: parsedUrl.pathname!,
          httpMethod: request.method as HTTPMethod,
          method: request.method,
          headers: request.headers,
          /* if duplicate queryParameters are present then API Gateway will flatten them into a comma-separated list
             eg: ?a=1&a=2&a=3 will be parsed as { a: [1,2,3] } by url.parse and flattenArraysInJSON will convert it to { a: '1,2,3' } which is the same behavior as API Gateway
          */
          queryStringParameters: flattenArraysInJSON(parsedUrl.query) as Record<string, string>,
          body: isBinaryUpload ? body.toString('base64') : body.toString('utf8'),
          isBase64Encoded: isBinaryUpload ? true : false,
          pathParameters: request.params,
          requestContext: copyOfRequestContext,
        };
        const rs = await this.handler(req, this.context);
        // for simple requests' CORS header
        this.enableCORS && this.setCORSHeaders(response);
        response.statusCode = rs.statusCode;
        response.writeHead(rs.statusCode, rs.headers);
        rs.body &&= Buffer.from(rs.body, rs.isBase64Encoded ? 'base64' : 'utf8');
        response.end(rs.body);
      });

    });

    this.app.listen(this.port, () => console.info(`🚀  Server ready at http://localhost:${this.port} at '${new Date().toLocaleString()}'`));
  }

  setCORSHeaders(res: Response): void {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
  }

}

export interface LocalLambdaConfig {
  handler: LambdaHandler;
  port?: number;
  context?: Context;
  enableCORS?: boolean;
  // default binary content-type headers or override
  binaryContentTypesOverride?: string[];
  pathParamsPattern ?: string;
  requestContext?: Record<string, any>;
}
