import { QuerySearchArgs } from '../generated/graphql';
import getElasticClient from '../utils/getElasticClient';
import elasticIndexes from '../utils/elasticIndexes';

const Query = {
  /**
   * Search for entities by search query
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   */
  async search(parent: undefined, args: QuerySearchArgs) { // todo add return value
    const client = getElasticClient();

    const result = await client.search({
      index: elasticIndexes.locationsView,
      body: {
        query: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          multi_match: {
            query: args.input.query,
            fields: [
              'name.*^2',
              'description.*',
              '*',
            ],
          },
        },
      },
    });

    // todo fix types
    return result.body.hits.hits.map((hit: any) =>
      ({
        ...hit._source,
        __typename: 'LocationInstance',
      })
    );
  },
};

export default {
  Query,
};
