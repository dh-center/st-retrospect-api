import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import getDbConnection from './db';
import { ResolverContextBase } from './types/graphql';

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
    context(): ResolverContextBase {
      return {
        db: dbConnection
      };
    }
  });

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`)
  );
})();
