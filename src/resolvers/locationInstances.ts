import emptyMutation from '../utils/emptyMutation';
import {
  AddArchitectInput,
  CreateLocationInstanceInput, RemoveArchitectInput, RemoveArchitectPayload,
  UpdateLocationInstanceInput
} from '../generated/graphql';
import { CreateLocationInstanceInput, UpdateLocationInstanceInput } from '../generated/graphql';
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
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - mutation input object
   * @param collection - method for accessing to database collections
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

    await sendNotify('LocationInstance', 'location', db, user, 'create', input);

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
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - mutation input object
   * @param contextBase - context with collections, db connection
   */
  async addArchitect(
    parent: undefined,
    { input }: { input: AddArchitectInput },
    contextBase: ResolverContextBase
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
      },
    },
    contextBase);
  },

  /**
   * Remove architect
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - mutation input object
   * @param contextBase - context with collections, db connection
   */
  async removeArchitect(
    parent: undefined,
    { input }: { input: RemoveArchitectInput },
    contextBase: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
    const relation = await contextBase.collection('relations').findOne({
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
    contextBase);
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
    { db, user, collection }: ResolverContextBase
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

    await sendNotify('LocationInstance', 'location', db, user, 'update', input, 'location_instances');

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
