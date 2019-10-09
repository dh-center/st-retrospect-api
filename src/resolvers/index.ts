import merge from 'lodash.merge';

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

export default merge(indexResolver);
