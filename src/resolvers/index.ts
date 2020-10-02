import merge from 'lodash.merge';

import persons from './persons';
import locations from './locations';
import locationInstances from './locationInstances';
import routes from './routes';
import users from './users';
import relations from './relations';
import quests from './quests';
import { JSONResolver, LongResolver, TimestampResolver } from 'graphql-scalars';
import scalars from './scalars';
import { ResolverContextBase } from '../types/graphql';
import { fromGlobalId } from '../utils/globalId';
import { QueryNodeArgs } from '../generated/graphql';

/**
 * See all types and fields here {@link '../typeDefs/schema.graphql'}
 */
const indexResolver = {
  Query: {
    node(parent: undefined, args: QueryNodeArgs, context: ResolverContextBase) {
      const { type, id } = fromGlobalId(args.id);

      if (type === 'Person') {
        return context.dataLoaders.personById.load(id.toString());
      }

      return null;
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
  quests,
  scalars
);
