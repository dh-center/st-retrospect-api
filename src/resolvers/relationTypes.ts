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
import mapArrayInputToMultilingual from '../utils/mapStringsArrayToMultilingual';

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
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async create(
    parent: undefined,
    { input }: { input: CreateRelationTypeInput & {synonyms: string[]} },
    { db, user, collection, languages }: ResolverContextBase
  ): Promise<CreateMutationPayload<RelationTypeDBScheme>> {
    const newInput = {
      ...input,
      synonyms: mapArrayInputToMultilingual(input.synonyms || [], languages),
    };

    const relationType = (await collection('relationtypes').insertOne(newInput)).ops[0];

    await sendNotify('RelationType', 'relation-types', db, user, 'create', relationType);

    return {
      recordId: relationType._id,
      record: relationType,
    };
  },

  /**
   * Update relation type
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateRelationTypeInput },
    { db, user, collection, languages }: ResolverContextBase
  ): Promise<UpdateMutationPayload<RelationTypeDBScheme>> {
    const newInput = {
      _id: new ObjectId(input.id),
      ...input,
      id: undefined,
      synonyms: mapArrayInputToMultilingual(input.synonyms || [], languages),
    } as RelationTypeDBScheme;

    const originalRelationType = await collection('relationtypes').findOne({
      _id: newInput._id,
    });

    if (!originalRelationType) {
      throw new UserInputError('There is no relation type with such id: ' + newInput._id);
    }

    await sendNotify('RelationType', 'relation-types', db, user, 'update', newInput, 'relationtypes');

    const relationType = await collection('relationtypes').findOneAndUpdate(
      { _id: newInput._id },
      {
        $set: mergeWith(
          originalRelationType,
          newInput,
          (original, inp) => {
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
      throw new UserInputError('Can\'t update relation type with such id: ' + newInput._id);
    }

    return {
      recordId: newInput._id,
      record: relationType.value,
    };
  },

  /**
   * Delete relation type
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
    const originalRelationType = await db.collection('relationtypes').findOne({
      _id: id,
    });

    await sendNotify('RelationType', 'relation-types', db, user, 'delete', originalRelationType);

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
