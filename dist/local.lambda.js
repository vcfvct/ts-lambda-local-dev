"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalLambda = void 0;
const http_1 = require("http");
const url = __importStar(require("url"));
const DefaultPort = 8000;
class LocalLambda {
    constructor(config) {
        var _a, _b;
        this.handler = config.handler;
        this.port = (_a = config.port) !== null && _a !== void 0 ? _a : DefaultPort;
        this.context = config.context || {};
        this.enableCORS = (_b = config.enableCORS) !== null && _b !== void 0 ? _b : true;
    }
    run() {
        const server = (0, http_1.createServer)((request, response) => {
            let data = [];
            const parsedUrl = url.parse(request.url, true);
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
                let body = Buffer.concat(data);
                const req = {
                    path: parsedUrl.pathname,
                    httpMethod: request.method,
                    method: request.method,
                    headers: request.headers,
                    queryStringParameters: parsedUrl.query,
                    body: body.toString('base64'),
                    isBase64Encoded: true,
                };
                const rs = await this.handler(req, this.context);
                // for simple requests' CORS header
                this.enableCORS && this.setCORSHeaders(response);
                response.statusCode = rs.statusCode;
                response.writeHead(rs.statusCode, rs.headers);
                rs.body && (rs.body = Buffer.from(rs.body, rs.isBase64Encoded ? 'base64' : 'utf8'));
                response.end(rs.body);
            });
        });
        server.listen(this.port, () => console.info(`🚀  Server ready at http://localhost:${this.port} at '${new Date().toLocaleString()}'`));
    }
    setCORSHeaders(res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', '*');
    }
}
exports.LocalLambda = LocalLambda;
//# sourceMappingURL=local.lambda.js.map