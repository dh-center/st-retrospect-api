import { CreateLocationStyleInput } from '../generated/graphql';
import { CreateMutationPayload, ResolverContextBase } from '../types/graphql';
import { LocationStyleDBScheme } from './locations';
import emptyMutation from '../utils/emptyMutation';

const LocationStyleMutations = {
  /**
   * Create new location style
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async create(
    parent: undefined,
    { input }: { input: CreateLocationStyleInput },
    { collection }: ResolverContextBase
  ): Promise<CreateMutationPayload<LocationStyleDBScheme>> {
    /**
     * Create style in DB
     */
    const locationStyle = (await collection('locationstyles').insertOne(input)).ops[0];

    // await sendNotify('LocationStyle', 'location', db, user, 'create', locationStyle);

    return {
      recordId: locationStyle._id,
      record: locationStyle,
    };
  },
};

const Mutation = {
  locationStyles: emptyMutation,
};

export default {
  LocationStyleMutations,
  Mutation,
};
