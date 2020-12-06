import emptyMutation from '../utils/emptyMutation';
import {
  AddArchitectInput,
  RemoveArchitectInput,
  CreateLocationInstanceInput,
  UpdateLocationInstanceInput
} from '../generated/graphql';

import {
  CreateMutationPayload,
  DeleteMutationPayload,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { ARCHITECT_RELATION_ID, LocationInstanceDBScheme } from './locations';
import { ObjectId } from 'mongodb';
import { UserInputError } from 'apollo-server-express';
import mergeWith from 'lodash.mergewith';
import Relations, { RelationDBScheme } from './relations';
import sendNotify from '../utils/telegramNotify';

const LocationInstanceMutations = {
  /**
   * Create new location location instance
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async create(
    parent: undefined,
    { input }: { input: CreateLocationInstanceInput },
    { db, user, collection }: ResolverContextBase
  ): Promise<CreateMutationPayload<LocationInstanceDBScheme>> {
    /**
     * Create instance in DB
     */
    const locationInstance = (await collection('location_instances').insertOne(input)).ops[0];

    await sendNotify('LocationInstance', 'location', db, user, 'create', locationInstance);

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
   * Add new architect
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async addArchitect(
    parent: undefined,
    { input }: { input: AddArchitectInput },
    context: ResolverContextBase
  ): Promise<CreateMutationPayload<RelationDBScheme>> {
    return Relations.RelationMutations.create(undefined, {
      input: {
        locationInstanceId: input.locationInstanceId,
        personId: input.architectId,
        relationId: new ObjectId(ARCHITECT_RELATION_ID),
        quote: {
          ru: '',
          en: '',
        },
        link: {
          ru: '',
          en: '',
        },
      },
    },
    context);
  },

  /**
   * Remove architect
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async removeArchitect(
    parent: undefined,
    { input }: { input: RemoveArchitectInput },
    context: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
    const relation = await context.collection('relations').findOne({
      locationInstanceId: input.locationInstanceId,
      personId: input.architectId,
      relationId: new ObjectId(ARCHITECT_RELATION_ID),
    });

    if (!relation || !relation._id) {
      throw new UserInputError('Relation with such id didn\'t find');
    }

    return Relations.RelationMutations.delete(undefined, {
      id: relation?._id,
    },
    context);
  },

  /**
   * Update location instance
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateLocationInstanceInput },
    { db, user, collection }: ResolverContextBase
  ): Promise<UpdateMutationPayload<LocationInstanceDBScheme>> {
    const { id, ...rest } = input;
    const newInput = {
      _id: new ObjectId(id),
      ...rest,
    };

    const originalLocationInstance = await collection('location_instances').findOne({
      _id: newInput._id,
    });

    if (!originalLocationInstance) {
      throw new UserInputError('There is no location instance with such id: ' + newInput._id);
    }

    await sendNotify('LocationInstance', 'location', db, user, 'update', newInput, 'location_instances');

    const locationInstance = await collection('location_instances').findOneAndUpdate(
      { _id: newInput._id },
      {
        $set: {
          ...mergeWith(originalLocationInstance, newInput, (original, inp) => inp === null ? original : undefined),
        },
      },
      { returnOriginal: false }
    );

    if (!locationInstance.value) {
      throw new UserInputError('There is no location instance with such id: ' + newInput._id);
    }

    return {
      recordId: newInput._id,
      record: locationInstance.value,
    };
  },

  /**
   * Delete location instance
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async delete(
    parent: undefined,
    { id }: { id: ObjectId },
    { db, user, collection }: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
    const instance = (await collection('location_instances').findOneAndDelete({
      _id: id,
    })).value;

    if (!instance) {
      throw new UserInputError('There is no location instance with such id: ' + id);
    }

    await sendNotify('LocationInstance', 'location', db, user, 'delete', instance);

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
