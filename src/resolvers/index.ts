import merge from 'lodash.merge';

import persons from './persons';
import locations from './locations';
import routes from './routes';
import users from './users';
import relations from './relations';
import Cursor from './cursor';
import quests from './quests';
import { JSONResolver, LongResolver, TimestampResolver } from 'graphql-scalars';

/**
 * See all types and fields here {@link '../typeDefs/schema.graphql'}
 */
const indexResolver = {
  Query: {
    /**
     * Health-check endpoint
     *
     * @returns {string}
     */
    health: (): string => 'ok',
  },

  JSON: JSONResolver,
  Long: LongResolver,
  Timestamp: TimestampResolver,
};

export default merge(indexResolver, persons, locations, routes, users, relations, Cursor, quests);
