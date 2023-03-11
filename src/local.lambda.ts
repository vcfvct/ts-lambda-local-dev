import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Context } from 'aws-lambda';
import * as url from 'url';
import HTTPMethod from 'http-method-enum';
import { LambdaHandler, RequestEvent } from './types';

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

export class LocalLambda {
  handler: LambdaHandler;
  port: number;
  context: Context;
  enableCORS: boolean;
  binaryContentTypesOverride: string[];

  constructor(config: LocalLambdaConfig) {
    this.handler = config.handler;
    this.port = config.port ?? DefaultPort;
    this.context = config.context || {} as Context;
    this.enableCORS = config.enableCORS ?? true;
    this.binaryContentTypesOverride = config.binaryContentTypesOverride ?? defaultBinaryContentTypeHeaders;
  }

  run(): void {
    const server = createServer((request: IncomingMessage, response: ServerResponse) => {
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
        const isBinaryUpload = this.binaryContentTypesOverride.includes(contentType ?? '');
        const body = Buffer.concat(data);
        const req: RequestEvent = {
          path: parsedUrl.pathname!,
          httpMethod: request.method as HTTPMethod,
          method: request.method,
          headers: request.headers,
          queryStringParameters: parsedUrl.query as Record<string, string>,
          body: isBinaryUpload ? body.toString('base64') : body.toString('utf8'),
          isBase64Encoded: isBinaryUpload ? true : false,
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

    server.listen(this.port, () => console.info(`🚀  Server ready at http://localhost:${this.port} at '${new Date().toLocaleString()}'`));
  }

  setCORSHeaders(res: ServerResponse): void {
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
}
