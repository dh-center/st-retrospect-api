import {
  CreateLocationStyleInput,
  UpdateLocationStyleInput
} from '../generated/graphql';
import { CreateMutationPayload, ResolverContextBase, UpdateMutationPayload } from '../types/graphql';
import { LocationStyleDBScheme } from './locations';
import emptyMutation from '../utils/emptyMutation';
import { ObjectId } from 'mongodb';
import { UserInputError } from 'apollo-server-express';
import mergeWithCustomizer from '../utils/mergeWithCustomizer';

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

    return {
      recordId: locationStyle._id,
      record: locationStyle,
    };
  },

  /**
   * Updates location style
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateLocationStyleInput },
    { collection }: ResolverContextBase
  ): Promise<UpdateMutationPayload<LocationStyleDBScheme>> {
    const { id, ...rest } = input;
    const newInput: LocationStyleDBScheme = {
      _id: new ObjectId(id),
      ...rest,
    };

    const originalLocationStyle = await collection('locationstyles').findOne({
      _id: newInput._id,
    });

    if (!originalLocationStyle) {
      throw new UserInputError('There is no location style with such id: ' + newInput._id);
    }

    const locationStyle = await collection('locationstyles').findOneAndUpdate(
      { _id: newInput._id },
      {
        $set: mergeWithCustomizer(originalLocationStyle, newInput),
      },
      { returnOriginal: false });

    if (!locationStyle.value) {
      throw new UserInputError('Can\'t update location style with such id: ' + newInput._id);
    }

    return {
      recordId: newInput._id,
      record: locationStyle.value,
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
