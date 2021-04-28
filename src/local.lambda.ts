import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Context } from 'aws-lambda';
import * as url from 'url';
import HTTPMethod from 'http-method-enum';
import { LambdaHandler, RequestEvent } from './types';

const DefaultPort = 8000;

export class LocalLambda {
  handler: LambdaHandler;
  port: number;
  context: Context;

  constructor(config: LocalLambdaConfig) {
    this.handler = config.handler;
    this.port = config.port ?? DefaultPort;
    this.context = config.context || {} as Context;
  }

  run(): void {
    const server = createServer((request: IncomingMessage, response: ServerResponse) => {
      let data = '';
      const parsedUrl = url.parse(request.url!, true);

      request.on('data', chunk => {
        data += chunk;
      });
      request.on('end', async () => {
        const req: RequestEvent = {
          path: parsedUrl.pathname!,
          httpMethod: request.method as HTTPMethod,
          method: request.method,
          headers: request.headers,
          queryStringParameters: parsedUrl.query,
          body: data,
        };
        const rs = await this.handler(req, this.context);
        response.statusCode = rs.statusCode;
        response.writeHead(rs.statusCode, rs.headers);
        response.end(rs.body);
      });

    });

    server.listen(this.port, () => console.info(`🚀  Server ready at http://localhost:${this.port} at '${new Date().toLocaleString()}'`));
  }
}

export interface LocalLambdaConfig {
  handler: LambdaHandler;
  port?: number;
  context?: Context;
}
