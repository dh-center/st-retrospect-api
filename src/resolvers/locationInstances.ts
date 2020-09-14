import emptyMutation from '../utils/emptyMutation';
import { CreateLocationInput, CreateLocationInstanceInput } from '../generated/graphql';
import { CreateMutationPayload, ResolverContextBase } from '../types/graphql';
import { WithoutId } from '../types/utils';
import { LocationDBScheme, LocationInstanceDBScheme } from './locations';

const LocationInstanceMutations = {
  /**
   * Create new location location instance
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - mutation input object
   * @param collection - method for accessing to database collections
   */
  async create(
    parent: undefined,
    { input }: { input: CreateLocationInstanceInput },
    { collection }: ResolverContextBase
  ): Promise<CreateMutationPayload<LocationInstanceDBScheme>> {
    console.log(input);
    /**
     * Create instance in DB
     */
    const locationInstance = (await collection('location_instances').insertOne(input)).ops[0];

    /**
     * Link instance to location
     */
    await collection('locations').updateOne({ _id: input.locationId }, {
      $addToSet: {
        locationInstanceIds: locationInstance._id,
      },
    });

    return {
      recordId: locationInstance._id,
      record: locationInstance,
    };
  },
};

const Mutation = {
  locationInstances: emptyMutation,
};

export default {
  Mutation,
  LocationInstanceMutations,
};
