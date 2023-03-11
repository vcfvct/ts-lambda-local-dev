## A simple local server proxy for aws lambda development

During aws lambda api development, either fronted by api-gateway or ALB, one issue is local development because lambda is a aws managed run time. Tools like SAM can do that but requires docker and not that flexible in terms of watch file change etc. Also it is kind of heavy due to the other functionality it has(CloudFormation etc...).


The goal of this package is to create a simple server that proxies http request to the your nodejs Lambda `handler` function. Also we all the the benefit of Typescript, so we can optionally add watch function which will reload server after change saved.


## Install
> npm install ts-lambda-local-dev -D

## Usage

### Local server.
Add below file as something like `local.server.ts` in your project and run with `ts-node`.
```typescript
import { LocalLambda, LocalLambdaConfig  } from 'ts-lambda-local-dev';
// assume your Lambda entry point is `handler()` inside `index.ts`
import { handler } from './index'

// context is provided as optional field in config.
const config: LocalLambdaConfig = {
  handler: handler, // if type is not compatible, do `handler: handler as any`
  port: 8000, // optional, default to 8000
}

const localLambda = new LocalLambda(config);
localLambda.run();
```

`CORS` is enabled *by default*, you can pass in `enableCORS: false` to disable it.

`binaryContentTypesOverride` is also enabled by default, you can pass in `binaryContentTypesOverride: []` to disable it or pass in your own list of content types that should be treated as binary content.

## Debug and Watch file change and auto-reload
This package included `ts-node-dev` as a dependency which would watch file change and use the ts-node compilation result to trigger reload. See the sample configurations in the `example/` directory of this repo for more details.

### VSCode
assume your `local.server.ts` is in `src/`. include below config in your `.vscode/launch.json`.

```json
{
  "version": "1.0.0",
  "configurations": [
    {
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "name": "Local Server",
      "restart": true,
      "request": "launch",
      "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/ts-node-dev",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node",
      "runtimeArgs": [
        "--respawn"
      ],
      "args": [
        "${workspaceFolder}/src/local.server.ts"
      ]
    }
  ]
}
```

### JetBrain(WebStorm/IntellJ)
in your Run/Debug Configuration, add a node.js config with below params:
```
 JavaScript file ---> node_modules/ts-node-dev/lib/bin.js
 Application parameters ---> --respawn -- src/script/local.server.ts
```

![Idea-Screenshot](/images/jetbrain-config.png?raw=true "jetbrain")
