/* eslint-disable @typescript-eslint/naming-convention */
import {
  QueryLocationInstanceByPersonSearchArgs,
  QueryLocationInstancesSearchArgs,
  QueryLocationsSearchArgs
} from '../generated/graphql';
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
  async locationInstancesSearch(parent: undefined, { input }: QueryLocationInstancesSearchArgs) { // todo add return value
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
      suggest: result.body.suggest?.phrase_suggester?.shift()?.options?.shift()?.highlighted,
    };
  },

  /**
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async locationsSearch(parent: undefined, { input }: QueryLocationsSearchArgs, { collection }: ResolverContextBase) { // todo add return value
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
            'instances.name.*^10',
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
        query,
        suggest: {
          text: input.query,
          phrase: {
            phrase: {
              field: 'suggest',
              size: 1,
              gram_size: 3,
              direct_generator: [
                {
                  field: 'suggest',
                  suggest_mode: 'always',
                },
              ],
              highlight: {
                pre_tag: '<b>',
                post_tag: '</b>',
              },
            },
          },
        },
      },
    });

    // todo fix types

    return {
      edges:
        result.body.hits.hits.map((hit: any) =>
          ({
            node: {
              _id: hit._id,
              ...hit._source,
            },
            searchScore: hit._score,
          })),
      totalCount: result.body.hits.total.value,
      suggest: result.body.suggest?.phrase?.shift()?.options?.shift()?.highlighted,
    };
  },


  async locationInstanceByPersonSearch(parent: undefined, { input }: QueryLocationInstanceByPersonSearchArgs, { collection }: ResolverContextBase) {
    const client = getElasticClient();
    let query;

    if (!input.query) {
      const relations = await collection('relations')
        .find()
        .skip(input.windowedPagination?.skip || 0)
        .limit(input.windowedPagination?.first || 10)
        .toArray();


      return {
        edges:
          relations.map((location) => {
            return ({
              node: location,
            });
          }),
        totalCount: await collection('relations')
          .find()
          .count(),
      };
    } else {
      query = {
        multi_match: {
          query: input.query,
          fuzziness: 3,
          fields: [
            'person.name.*',
          ],
        },
      };
    }

    const result = await client.search({
      index: elasticIndexes.relations,
      body: {
        from: input.windowedPagination?.skip,
        size: input.windowedPagination?.first,
        query,
      },
    });

    // todo fix types

    return {
      edges:
        result.body.hits.hits.map((hit: any) => {
          return ({
            node: hit._source.locationInstance,
            searchScore: hit._score,
          });
        }),
      totalCount: result.body.hits.total.value,
      suggest: result.body.suggest?.phrase?.shift()?.options?.shift()?.highlighted,
    };
  },
};

export default {
  Query,
};
