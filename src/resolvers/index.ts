import merge from 'lodash.merge';

import persons from './persons';
import locations from './locations';
import locationInstances from './locationInstances';
import routes from './routes';
import users from './users';
import relations from './relations';
import relationTypes from './relationTypes';
import quests from './quests';
import address from './address';
import { JSONResolver, LongResolver, TimestampResolver } from 'graphql-scalars';
import scalars from './scalars';
import { ResolverContextBase } from '../types/graphql';
import { fromGlobalId } from '../utils/globalId';
import { QueryNodeArgs } from '../generated/graphql';
import camelCase from 'lodash.camelcase';
import { FieldsWithDataLoader } from '../dataLoaders';

/**
 * See all types and fields here {@link '../typeDefs/schema.graphql'}
 */
const indexResolver = {
  Query: {
    /**
     * Node resolver according to Global Object Identification (https://graphql.org/learn/global-object-identification/)
     *
     * @param parent - top-level resolver result
     * @param args - resolver args
     * @param dataLoaders.dataLoaders
     * @param dataLoaders - dataloader for data-fetching
     */
    async node(parent: undefined, args: QueryNodeArgs, { dataLoaders }: ResolverContextBase): Promise<unknown> {
      const { type, id } = fromGlobalId(args.id);

      const dataloaderName = camelCase(type) + 'ById' as FieldsWithDataLoader;

      const node = await dataLoaders[dataloaderName].load(id);

      return {
        ...node,
        __typename: type,
      };
    },
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
  relationTypes,
  quests,
  address,
  scalars
);
