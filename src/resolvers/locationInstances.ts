import emptyMutation from '../utils/emptyMutation';
import { CreateLocationInstanceInput, UpdateLocationInput, UpdateLocationInstanceInput } from '../generated/graphql';
import {
  CreateMutationPayload,
  DeleteMutationPayload,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { LocationDBScheme, LocationInstanceDBScheme } from './locations';
import { ObjectId } from 'mongodb';
import { UserInputError } from 'apollo-server-express';
import mergeWith from 'lodash.mergewith';

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

  /**
   * Update location instance
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - mutation input object
   * @param collection - method for accessing to database collections
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateLocationInstanceInput & {_id: ObjectId} },
    { collection }: ResolverContextBase
  ): Promise<UpdateMutationPayload<LocationInstanceDBScheme>> {
    input._id = new ObjectId(input.id);
    const id = input._id;

    delete input.id;

    const originalLocationInstance = await collection('location_instances').findOne({
      _id: id,
    });

    if (!originalLocationInstance) {
      throw new UserInputError('There is no location instance with such id: ' + id);
    }

    const locationInstance = await collection('location_instances').findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...mergeWith(originalLocationInstance, input, (original, inp) => inp === null ? original : undefined),
        },
      },
      { returnOriginal: false }
    );

    if (!locationInstance.value) {
      throw new UserInputError('There is no location instance with such id: ' + id);
    }

    return {
      recordId: id,
      record: locationInstance.value,
    };
  },

  /**
   * Delete location instance
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - object id
   * @param collection - method for accessing to database collections
   */
  async delete(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection }: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
    const instance = (await collection('location_instances').findOneAndDelete({
      _id: id,
    })).value;

    if (!instance) {
      throw new UserInputError('There is no location instance with such id: ' + id);
    }

    await collection('relations').deleteMany({
      locationInstanceId: id,
    });

    await collection('locations').updateOne({
      _id: instance.locationId,
    },
    {
      $pull: {
        locationInstanceIds: instance._id,
      },
    });

    return {
      recordId: new ObjectId(id),
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
