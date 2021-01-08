import './env';
import { ApolloServer, AuthenticationError, ValidationError } from 'apollo-server-express';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import getDbConnection from './db';
import { AccessTokenData, CollectionAccessFunction, Languages, ResolverContextBase } from './types/graphql';
import languageParser from 'accept-language-parser';
import bodyParser from 'body-parser';
import router from './router';
import { ApiError } from './errorTypes';
import errorHandler from './middlewares/errorHandler';
import multilingualDirective from './directives/multilingual';
import paginationDirective from './directives/pagination';
import fromFieldDirective from './directives/fromField';
import authCheckDirective from './directives/authСheck';
import adminCheckDirective from './directives/adminCheck';
import dataLoaderDirective from './directives/dataloaders';
import * as Sentry from '@sentry/node';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import DataLoaders from './dataLoaders';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import globalIdResolver from './globalIdResolver';
import toGlobalIdDirective from './directives/toGlobalId';

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

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaTransforms: [
      globalIdResolver,
      toGlobalIdDirective('toGlobalId'),
      paginationDirective('pagination'),
      multilingualDirective('multilingual'),
      fromFieldDirective('fromField'),
      authCheckDirective('authCheck'),
      adminCheckDirective('adminCheck'),
      dataLoaderDirective('dataLoader'),
    ],
  });

  const apolloServer = new ApolloServer({
    schema,
    formatError: (error: GraphQLError): GraphQLError => {
      if (!(error instanceof ValidationError) && !(error.originalError instanceof AuthenticationError)) {
        Sentry.captureException(error);
      }

      return error;
    },
    playground: true,
    async context({ req }): Promise<ResolverContextBase> {
      let languages = [ Languages.RU ];

      const languageHeader = req.headers['accept-language'];

      if (languageHeader) {
        languages = languageParser.parse(languageHeader ? languageHeader.toString() : '').map((language) => {
          return language.code.toUpperCase() as Languages;
        });
      }

      let user: AccessTokenData = {
        id: '',
        isAdmin: false,
      };

      if (req.headers.authorization) {
        const authorizationHeader = req.headers.authorization;

        if (/^Bearer [a-z0-9-_+/=]+\.[a-z0-9-_+/=]+\.[a-z0-9-_+/=]+$/i.test(authorizationHeader)) {
          const jsonToken = authorizationHeader.slice(7);

          user = await jwt.verify(jsonToken, process.env.JWT_SECRET_STRING || 'secret_string') as AccessTokenData;
        }
      }

      return {
        db: dbConnection,
        languages,
        user,
        dataLoaders,
        collection: (name => dbConnection.collection(name)) as CollectionAccessFunction,
      };
    },
  });

  apolloServer.applyMiddleware({ app });
  app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));

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
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`)
  );
})();
