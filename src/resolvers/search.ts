import { Client } from '@elastic/elasticsearch';
import { QuerySearchArgs } from '../generated/graphql';
import { ResolverContextBase } from '../types/graphql';
import { GraphQLResolveInfo } from 'graphql';

const Query = {
  async search(parent: undefined, args: QuerySearchArgs, context: ResolverContextBase, info: GraphQLResolveInfo) {
    const client = new Client({ node: process.env.ELASTICSEARCH_ENDPOINT });

    const result = await client.search({
      index: 'db-interface.location_instances',
      body: {
        query: {
          match_all: {},
        },
      },
    });

    console.log(JSON.stringify(info));

    console.log(result.body.hits);

    return result.body.hits.hits.map((hit: any) => ({
      ...hit._source,
      __typename: 'LocationInstance' })
    );
  },
};

export default {
  Query,
};
