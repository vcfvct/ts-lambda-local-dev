import { Context } from 'aws-lambda';
import express from 'express';
import { LambdaHandler } from 'index';
import { DefaultPathParamsPattern, DefaultPort, LocalLambda } from './local.lambda';


export interface LambdaConfig {
  handler: LambdaHandler;
  context?: Context;
  enableCORS?: boolean;
  // default binary content-type headers or override
  binaryContentTypesOverride?: string[];
  pathParamsPattern ?: string;
  requestContext?: Record<string, any>;
}


export interface LocalLambdaGroupConfig {
  lambdas: LambdaConfig[];
  port?: number;
  defaultPath?: string;
}

export class LocalLambdaGroup {
  lambdas: LambdaConfig[] = [];
  app: express.Application;
  port: number;
  defaultPath: string;

  constructor(config: LocalLambdaGroupConfig) {
    this.lambdas = config.lambdas;
    this.app = express();
    this.port = config.port ?? DefaultPort;
    this.defaultPath = config.defaultPath ?? DefaultPathParamsPattern;
  }

  run(): void {
    this.lambdas.forEach(lambda => {
      const localLambda = new LocalLambda(lambda, this.app, this.defaultPath);
      localLambda.createServer();
      this.app = localLambda.app;
    });
    this.app.listen(this.port, () => console.info(`🚀  Lambda Group Server ready at http://localhost:${this.port} at '${new Date().toLocaleString()}'`));
  }
}