import merge from 'lodash.merge';
import { GraphQLJSON } from 'graphql-type-json';

import persons from './persons';
import locations from './locations';

/**
 * See all types and fields here {@link '../typeDefs/schema.graphql'}
 */
const indexResolver = {
  Query: {
    /**
     * Healthcheck endpoint
     * @return {string}
     */
    health: (): string => 'ok'
  },

  /**
   * Represents JSON object
   */
  JSON: GraphQLJSON
};

export default merge(indexResolver, persons, locations);
