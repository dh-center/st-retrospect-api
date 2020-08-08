import merge from 'lodash.merge';

import persons from './persons';
import locations from './locations';
import routes from './routes';
import users from './users';
import relations from './relations';
import Cursor from './cursor';
import quests from './quests';
import { resolvers } from 'graphql-scalars';

/**
 * See all types and fields here {@link '../typeDefs/schema.graphql'}
 */
const indexResolver = {
  ...resolvers,
  Query: {
    /**
     * Health-check endpoint
     *
     * @returns {string}
     */
    health: (): string => 'ok',
  },
};

export default merge(indexResolver, persons, locations, routes, users, relations, Cursor, quests);
