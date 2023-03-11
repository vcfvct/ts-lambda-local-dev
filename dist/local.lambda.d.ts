/// <reference types="node" />
import { ServerResponse } from 'http';
import { Context } from 'aws-lambda';
import { LambdaHandler } from './types';
export declare class LocalLambda {
    handler: LambdaHandler;
    port: number;
    context: Context;
    enableCORS: boolean;
    constructor(config: LocalLambdaConfig);
    run(): void;
    setCORSHeaders(res: ServerResponse): void;
}
export interface LocalLambdaConfig {
    handler: LambdaHandler;
    port?: number;
    context?: Context;
    enableCORS?: boolean;
}
//# sourceMappingURL=local.lambda.d.ts.map