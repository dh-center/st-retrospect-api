import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import getDbConnection from './db';
import { Languages, ResolverContextBase } from './types/graphql';
import languageParser from 'accept-language-parser';
import bodyParser from 'body-parser';
import router from './router';
import { ApiError } from './errorTypes';
import errorHandler from './middlewares/errorHandler';
import renameFieldDirective from './directives/renameField';
import * as Sentry from '@sentry/node';
import { GraphQLError } from 'graphql';

Sentry.init({ dsn: process.env.SENTRY_DSN });

(async (): Promise<void> => {
  dotenv.config({
    path: path.join(__dirname, '../.env')
  });

  const dbConnection = await getDbConnection();

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

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error: GraphQLError): GraphQLError => {
      Sentry.captureException(error);
      return error;
    },
    playground: true,
    schemaDirectives: {
      renameField: renameFieldDirective
    },
    context({ req }): ResolverContextBase {
      let languages: Languages[];

      if (req.headers['accept-language']) {
        languages = languageParser.parse(req.headers['accept-language'] ? req.headers['accept-language'].toString() : '').map((language) => {
          return language.code.toUpperCase() as Languages;
        });
      } else {
        languages = [ Languages.RU ];
      }

      return {
        db: dbConnection,
        languages
      };
    }
  });

  apolloServer.applyMiddleware({ app });

  /**
   * Setup sentry error handler
   */
  app.use(Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      return !(error instanceof ApiError);
    }
  }));

  /**
   * Setup error handler
   */
  app.use(errorHandler);

  app.listen({ port: process.env.PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`)
  );
})();
