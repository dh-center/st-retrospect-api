import { ApolloServer, AuthenticationError, ExpressContext, ValidationError } from 'apollo-server-express';
import schema from './schema';
import { GraphQLError } from 'graphql';
import { ApiError } from './errorTypes';
import * as Sentry from '@sentry/node';
import { CollectionAccessFunction, Languages, ResolverContextBase } from './types/graphql';
import languageParser from 'accept-language-parser';
import jwtHelper from './utils/jwt';
import { Db } from 'mongodb';
import DataLoaders from './dataLoaders';
import { Express } from 'express';


/**
 * GraphQL server wrapper
 */
export default class Server {
  /**
   * Apollo GraphQL server instance
   */
  public readonly apollo: ApolloServer;

  /**
   * Db connection to make queries
   */
  private readonly dbConnection: Db;

  /**
   * DataLoaders for fetching data
   */
  private readonly dataLoaders: DataLoaders;

  /**
   * @param dbConnection - db connection to make queries
   * @param dataLoaders - dataLoaders for fetching data
   */
  constructor(dbConnection: Db, dataLoaders: DataLoaders) {
    this.dbConnection = dbConnection;
    this.dataLoaders = dataLoaders;
    this.apollo = new ApolloServer({
      schema,
      formatError: error => this.formatError(error),
      playground: true,
      context: expressCtx => this.createContext(expressCtx),
    });
  }

  /**
   * Applies GraphQL middleware to express app
   *
   * @param app - app to setup
   */
  public setupMiddleware(app: Express): void {
    this.apollo.applyMiddleware({ app });
  }


  /**
   * Function for formatting errors
   *
   * @param error - error to format
   */
  private formatError(error: GraphQLError): GraphQLError {
    if (error.originalError instanceof ApiError && error.extensions) {
      error.extensions.code = error.originalError.code;
    }

    const errorsWhitelist = [ValidationError, AuthenticationError, ApiError];

    const isCaptureNeeded = !errorsWhitelist.some(ErrorType => error.originalError instanceof ErrorType);

    if (isCaptureNeeded) {
      Sentry.captureException(error);
    }

    return error;
  }

  /**
   * Function to setup GraphQL context
   *
   * @param expressContext - incoming query data
   */
  private createContext({ req }: ExpressContext): ResolverContextBase {
    let languages = [ Languages.RU ];

    const languageHeader = req.headers['accept-language'];

    if (languageHeader) {
      languages = languageParser.parse(languageHeader ? languageHeader.toString() : '').map((language) => {
        return language.code.toUpperCase() as Languages;
      });
    }

    const tokenData = jwtHelper.getDataFromHeader(req.headers.authorization);

    return {
      db: this.dbConnection,
      languages,
      tokenData,
      dataLoaders: this.dataLoaders,
      collection: (name => this.dbConnection.collection(name)) as CollectionAccessFunction,
    };
  }
}
