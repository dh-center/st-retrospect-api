import merge from 'lodash.merge';

import persons from './persons';
import locations from './locations';
import locationInstances from './locationInstances';
import routes from './routes';
import users from './users';
import relations from './relations';
import quests from './quests';
import { JSONResolver, LongResolver, TimestampResolver } from 'graphql-scalars';
import scalars from './scalars';

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

export default merge(
  indexResolver,
  persons,
  locations,
  locationInstances,
  routes,
  users,
  relations,
  quests,
  scalars
);
