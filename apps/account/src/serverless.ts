import { ExpressAdapter } from '@nestjs/platform-express'
import { APIGatewayProxyHandler } from 'aws-lambda'
import { createServer, proxy } from 'aws-serverless-express'
import { eventContext } from 'aws-serverless-express/middleware'
import express from 'express'

import type { Server } from 'http'

import { generateApp } from './main'

let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express()
  expressApp.use(eventContext())
  const app = await generateApp(
    new ExpressAdapter(expressApp),
  )
  await app.init()
  return createServer(expressApp)
};


export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};