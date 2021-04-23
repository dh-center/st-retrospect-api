/* eslint-disable @typescript-eslint/naming-convention */
import { QueryLocationsInstancesSearchArgs } from '../generated/graphql';
import getElasticClient from '../utils/getElasticClient';
import elasticIndexes from '../utils/elasticIndexes';
import { ResolverContextBase } from '../types/graphql';

const Query = {
  /**
   * Search for entities by search query
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   */
  async locationInstancesSearch(parent: undefined, { input }: QueryLocationsInstancesSearchArgs) { // todo add return value
    const client = getElasticClient();
    let query;

    if (!input.query) {
      query = {
        match_all: {},
      };
    } else {
      query = {
        multi_match: {
          query: input.query,
          fuzziness: 3,
          fields: [
            'name.*^2',
            'description.*',
            '*',
          ],
        },
      };
    }

    const result = await client.search({
      index: elasticIndexes.locationInstances,
      body: {
        from: input.windowedPagination?.skip,
        size: input.windowedPagination?.first,
        query,
      },
    });

    // todo fix types
    return {
      edges: result.body.hits.hits.map((hit: any) => {
        return ({
          node: {
            _id: hit._id,
            ...hit._source,
          },
        });
      }),
      totalCount: result.body.hits.total.value,
      suggest: result.body.suggest.phrase_suggester?.shift()?.options?.shift()?.highlighted,
    };
  },

  /**
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async locationsSearch(parent: undefined, { input }: QueryLocationsInstancesSearchArgs, { collection }: ResolverContextBase) { // todo add return value
    const client = getElasticClient();
    let query;

    if (!input.query) {
      const locations = await collection('locations')
        .find()
        .skip(input.windowedPagination?.skip || 0)
        .limit(input.windowedPagination?.first || 10)
        .toArray();


      return {
        edges:
          locations.map((location) => {
            return ({
              node: location,
            });
          }),
        totalCount: await collection('locations')
          .find()
          .count(),
      };
    } else {
      query = {
        multi_match: {
          query: input.query,
          fuzziness: 3,
          fields: [
            'instances.name.*^4',
            'description.*^2',
            '*',
          ],
        },
      };
    }

    const result = await client.search({
      index: elasticIndexes.locations,
      body: {
        from: input.windowedPagination?.skip,
        size: input.windowedPagination?.first,
        query
      },
    });

    // todo fix types

    return {
      edges:
        result.body.hits.hits.map((hit: any) => {
          return ({
            node: {
              _id: hit._id,
              ...hit._source,
            },
          });
        }),
      totalCount: result.body.hits.total.value,
      suggest: result.body.suggest?.phrase_suggester?.shift()?.options?.shift()?.highlighted,
    };
  },

};

export default {
  Query,
};
