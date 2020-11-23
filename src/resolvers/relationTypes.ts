import { ObjectId } from 'mongodb';
import {
  CreateMutationPayload,
  DeleteMutationPayload,
  MultilingualString,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { CreateRelationTypeInput, Maybe, UpdateRelationTypeInput } from '../generated/graphql';
import emptyMutation from '../utils/emptyMutation';
import { UserInputError } from 'apollo-server-express';
import mergeWith from 'lodash.mergewith';
import sendNotify from '../utils/telegramNotify';

/**
 * Relation type DB representation
 */
export interface RelationTypeDBScheme {
  /**
   * Relation type id
   */
  _id: ObjectId;

  /**
   * Relation type name
   */
  name: MultilingualString;

  /**
   * Relation type synonym
   */
  synonyms: Maybe<MultilingualString>[];
}

const RelationTypeMutations = {
  /**
   * Creates new relation type
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - relation type object
   * @param collection - collection in MongoDB for queries
   */
  async create(
    parent: undefined,
    { input }: { input: CreateRelationTypeInput },
    { db, user, collection }: ResolverContextBase
  ): Promise<CreateMutationPayload<RelationTypeDBScheme>> {
    const relationType = (await collection('relationtypes').insertOne(input)).ops[0];

    await sendNotify('RelationType', 'relation-types', db, user, 'create', input);

    return {
      recordId: relationType._id,
      record: relationType,
    };
  },

  /**
   * Update relation type
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - relation type object
   * @param collection - collection in MongoDB for queries
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateRelationTypeInput & {_id: ObjectId} },
    { db, user, collection }: ResolverContextBase
  ): Promise<UpdateMutationPayload<RelationTypeDBScheme>> {
    input._id = new ObjectId(input.id);
    const id = input._id;

    delete input.id;

    const originalRelationType = await collection('relationtypes').findOne({
      _id: id,
    });

    if (!originalRelationType) {
      throw new UserInputError('There is no relation type with such id: ' + id);
    }

    await sendNotify('RelationType', 'relation-types', db, user, 'update', input, 'relationtypes');

    const relationType = await collection('relationtypes').findOneAndUpdate(
      { _id: id },
      {
        $set: mergeWith(originalRelationType, input, (original, inp) => {
          if (inp === null) {
            return original;
          }
          if (Array.isArray(original)) {
            return inp;
          }

          return undefined;
        }),
      },
      { returnOriginal: false });

    if (!relationType.value) {
      throw new UserInputError('Can\'t update relation type with such id: ' + id);
    }

    return {
      recordId: id,
      record: relationType.value,
    };
  },

  /**
   * Delete relation type
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - relation type id
   * @param collection - collection in MongoDB for queries
   */
  async delete(
    parent: undefined,
    { id }: { id: ObjectId },
    { db, user, collection }: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
    const originalRelationtype = await db.collection('relationtypes').findOne({
      _id: id,
    });

    await sendNotify('RelationType', 'relation-types', db, user, 'delete', originalRelationtype);

    await collection('relationtypes').deleteOne({ _id: id });

    return {
      recordId: id,
    };
  },
};

const Mutation = {
  relationType: emptyMutation,
};

export default {
  Mutation,
  RelationTypeMutations,
};
