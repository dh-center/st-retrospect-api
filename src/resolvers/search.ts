/* eslint-disable @typescript-eslint/naming-convention */
import { QueryLocationsInstancesSearchArgs } from '../generated/graphql';
import getElasticClient from '../utils/getElasticClient';
import elasticIndexes from '../utils/elasticIndexes';
import { ResolverContextBase } from '../types/graphql';

const Query = {
  // /**
  //  * Search for entities by search query
  //  *
  //  * @param parent - this is the return value of the resolver for this field's parent
  //  * @param args - contains all GraphQL arguments provided for this field
  //  */
  // async search(parent: undefined, args: QuerySearchArgs) { // todo add return value
  //   const client = getElasticClient();
  //
  //   const result = await client.search({
  //     index: elasticIndexes.locationsView,
  //     body: {
  //       query: {
  //         // eslint-disable-next-line @typescript-eslint/naming-convention
  //         multi_match: {
  //           query: args.input.query,
  //           fields: [
  //             'name.*^2',
  //             'description.*',
  //             '*',
  //           ],
  //         },
  //       },
  //     },
  //   });
  //
  //   // todo fix types
  //   return result.body.hits.hits.map((hit: any) =>
  //     ({
  //       ...hit._source,
  //       __typename: 'LocationInstance',
  //     })
  //   );
  // },


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
      index: elasticIndexes.locationsView,
      body: {
        from: input.windowedPagination?.skip,
        size: input.windowedPagination?.first,
        query,
        suggest: {
          text: input.query,
          phrase_suggester: {
            phrase: {
              field: 'name.ru.trigram',
              size: 1,
              gram_size: 3,
              direct_generator: [
                {
                  field: 'name.ru.trigram',
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

    // console.log(JSON.stringify(result.body, null, 2));
    // console.log(result.body.hits.hits.length);
    // console.log(result.body.hits.total.value);

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
   *
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   */
  async locationsSearch(parent: undefined, { input }: QueryLocationsInstancesSearchArgs) { // todo add return value
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
      index: elasticIndexes.locationsView,
      body: {
        from: input.windowedPagination?.skip,
        size: input.windowedPagination?.first,
        query,
        suggest: {
          text: input.query,
          phrase_suggester: {
            phrase: {
              field: 'name.ru.trigram',
              size: 1,
              gram_size: 3,
              direct_generator: [
                {
                  field: 'name.ru.trigram',
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

    // console.log(JSON.stringify(result.body, null, 2));
    // console.log(result.body.hits.hits.length);
    // console.log(result.body.hits.total.value);

    // todo fix types

    return {
      edges:
        result.body.hits.hits.map((hit: any) => {
          return ({
            node: {
              ...hit._source.location,
            },
          });
        }),
      totalCount: result.body.hits.total.value,
      suggest: result.body.suggest.phrase_suggester?.shift()?.options?.shift()?.highlighted,
    };
  },

};

export default {
  Query,
};
