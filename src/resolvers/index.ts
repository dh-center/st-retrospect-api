import merge from 'lodash.merge';

import persons from './persons';

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
  }
};

export default merge(indexResolver, persons);
