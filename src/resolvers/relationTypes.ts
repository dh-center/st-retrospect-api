import { ObjectId } from 'mongodb';
import {
  CreateMutationPayload,
  DeleteMutationPayload,
  Multilingual,
  MultilingualString,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { CreateRelationTypeInput, UpdateRelationTypeInput } from '../generated/graphql';
import emptyMutation from '../utils/emptyMutation';
import { UserInputError } from 'apollo-server-express';
import sendNotify from '../utils/telegramNotify';
import mergeWithCustomizer from '../utils/mergeWithCustomizer';

/**
 * Part of the relation type with synonyms
 *
 * @todo remove when @multilingual directive can generate multilingual fields
 */
interface WithSynonyms {
  /**
   * Relation type synonym
   */
  synonyms: Multilingual<string[]>;
}

/**
 * Relation type DB representation
 */
export interface RelationTypeDBScheme extends WithSynonyms{
  /**
   * Relation type id
   */
  _id: ObjectId;

  /**
   * Relation type name
   */
  name?: MultilingualString | null;
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
    { input }: { input: CreateRelationTypeInput & WithSynonyms },
    { db, user, collection }: ResolverContextBase
  ): Promise<CreateMutationPayload<RelationTypeDBScheme>> {
    const newInput = {
      ...input,
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
    { input }: { input: UpdateRelationTypeInput & WithSynonyms },
    { db, user, collection }: ResolverContextBase
  ): Promise<UpdateMutationPayload<RelationTypeDBScheme>> {
    const { id, ...rest } = input;
    const newInput: RelationTypeDBScheme = {
      _id: new ObjectId(id),
      ...rest,
    };

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
        $set: mergeWithCustomizer(originalRelationType, newInput),
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
