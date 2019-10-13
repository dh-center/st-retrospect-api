import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import getDbConnection from './db';
import { Languages, ResolverContextBase } from './types/graphql';
import languageParser from 'accept-language-parser';

(async (): Promise<void> => {
  dotenv.config({
    path: path.join(__dirname, '../.env')
  });

  const dbConnection = await getDbConnection();

  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
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

  app.listen({ port: process.env.PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`)
  );
})();
