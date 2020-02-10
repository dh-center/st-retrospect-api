import { ApolloServer, ValidationError } from 'apollo-server-express';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import getDbConnection from './db';
import { AccessTokenData, Languages, ResolverContextBase } from './types/graphql';
import languageParser from 'accept-language-parser';
import bodyParser from 'body-parser';
import router from './router';
import { ApiError } from './errorTypes';
import errorHandler from './middlewares/errorHandler';
import renameFieldDirective from './directives/renameField';
import Multilingual from './directives/multilingual';
import * as Sentry from '@sentry/node';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import DataLoaders from './dataLoaders';
import multilingual from "./directives/multilingual";

Sentry.init({ dsn: process.env.SENTRY_DSN });

(async (): Promise<void> => {
  dotenv.config({
    path: path.join(__dirname, '../.env')
  });

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

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error: GraphQLError): GraphQLError => {
      if (!(error instanceof ValidationError)) {
        Sentry.captureException(error);
      }
      return error;
    },
    playground: true,
    schemaDirectives: {
      renameField: renameFieldDirective,
      multilingual: Multilingual
    },
    async context({ req }): Promise<ResolverContextBase> {
      let languages: Languages[];

      if (req.headers['accept-language']) {
        languages = languageParser.parse(req.headers['accept-language'] ? req.headers['accept-language'].toString() : '').map((language) => {
          return language.code.toUpperCase() as Languages;
        });
      } else {
        languages = [ Languages.RU ];
      }

      let jsonToken = '';
      let user: AccessTokenData = {
        id: '',
        isAdmin: false
      };

      if (req.headers.authorization) {
        jsonToken = req.headers.authorization;
        if (/^Bearer [a-z0-9-_+/=]+\.[a-z0-9-_+/=]+\.[a-z0-9-_+/=]+$/i.test(jsonToken)) {
          jsonToken = jsonToken.slice(7);
          user = await jwt.verify(jsonToken, process.env.JWT_SECRET_STRING || 'secret_string') as AccessTokenData;
        }
      }

      return {
        db: dbConnection,
        languages,
        user,
        dataLoaders
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
