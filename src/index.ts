import './env';
import express from 'express';
import getDbConnection from './db';
import bodyParser from 'body-parser';
import router from './router';
import { ApiError } from './errorTypes';
import errorHandler from './middlewares/errorHandler';
import * as Sentry from '@sentry/node';
import DataLoaders from './dataLoaders';
import Server from './server';

console.log('⚡️ Server starting');

Sentry.init({ dsn: process.env.SENTRY_DSN });

(async (): Promise<void> => {
  const dbConnection = await getDbConnection();

  const dataLoaders = new DataLoaders(dbConnection);

  const app = express();

  /**
   * Setup necessary middlewares
   */
  app.use(Sentry.Handlers.requestHandler());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  /**
   * Add headers for allow CORS
   */
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  /**
   * Setup routes
   */
  app.use(router);

  /**
   * Setup GraphQL server
   */
  const server = new Server(dbConnection, dataLoaders);

  server.setupMiddleware(app);

  /**
   * Setup sentry error handler
   */
  app.use(Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      return !(error instanceof ApiError);
    },
  }));

  /**
   * Setup error handler
   */
  app.use(errorHandler);

  app.listen({ port: process.env.PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.apollo.graphqlPath}`)
  );
})().catch(e => console.error('Error during server starting: ', e));
