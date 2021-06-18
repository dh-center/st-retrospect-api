import merge from 'lodash.merge';

import persons from './persons';
import locations from './locations';
import locationInstances from './locationInstances';
import users from './users';
import relations from './relations';
import relationTypes from './relationTypes';
import quests from './quests';
import search from './search';
import achievements from './achievements';
import address from './address';
import { JSONResolver, LongResolver, TimestampResolver } from 'graphql-scalars';
import scalars from './scalars';
import { ResolverContextBase } from '../types/graphql';
import { fromGlobalId } from '../utils/globalId';
import { QueryNodeArgs } from '../generated/graphql';
import camelCase from 'lodash.camelcase';
import { FieldsWithDataLoader } from '../dataLoaders';
import locationStyles from './locationStyles';
import tags from './tags';

/**
 * See all types and fields here {@link '../typeDefs/schema.graphql'}
 */
const indexResolver = {
  Query: {
    /**
     * Node resolver according to Global Object Identification (https://graphql.org/learn/global-object-identification/)
     *
     * @param parent - this is the return value of the resolver for this field's parent
     * @param args - contains all GraphQL arguments provided for this field
     * @param context - this object is shared across all resolvers that execute for a particular operation
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
  locationStyles,
  locationInstances,
  users,
  relations,
  relationTypes,
  quests,
  search,
  achievements,
  address,
  tags,
  scalars
);
