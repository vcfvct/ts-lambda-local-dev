import { createServer, IncomingMessage, ServerResponse } from 'http';
import { HttpHeaders, LambdaHandler, RequestEvent } from './types';
import { Context } from 'aws-lambda';

const DefaultPort = 8000;

export class LocalLambda {
  handler: LambdaHandler;
  port: number;
  context?: Context;

  constructor(config: LocalLambdaConfig) {
    this.handler = config.handler;
    this.port = config.port ?? DefaultPort;
    this.context = config.context;
  }

  run(): void {
    const server = createServer((request: IncomingMessage, response: ServerResponse) => {
      let data = '';
      request.on('data', chunk => {
        data += chunk;
      });
      request.on('end', async () => {
        const req: RequestEvent = {
          path: request.url!,
          httpMethod: request.method,
          method: request.method,
          headers: request.headers as HttpHeaders,
          body: data,
        };
        const rs = await this.handler(req, this.context);
        response.statusCode = rs.statusCode;
        response.writeHead(rs.statusCode, rs.headers).end(rs.body);
      });

    });

    server.listen(this.port, () => console.info(`🚀  Server ready at http://localhost:${this.port} at ${new Date().toLocaleString()}`));
  }
}

export interface LocalLambdaConfig {
  handler: LambdaHandler;
  port?: number;
  context?: Context;
}
