import { ObjectId } from 'mongodb';
import {
  CreateMutationPayload,
  DeleteMutationPayload,
  MultilingualString,
  ResolverContextBase, UpdateMutationPayload
} from '../types/graphql';
import emptyMutation from '../utils/emptyMutation';
import { CreateRelationInput, UpdateRelationInput } from '../generated/graphql';
import { UserInputError } from 'apollo-server-express';
import sendNotify from '../utils/telegramNotify';
import mergeWithCustomizer from '../utils/mergeWithCustomizer';
import { LocationInstanceDBScheme } from './locations';
import { PersonDBScheme } from './persons';

/**
 * Relation's database scheme
 */
export interface RelationDBScheme {
  /**
   * Relation id
   */
  _id: ObjectId;

  /**
   * Location id
   */
  locationInstanceId: ObjectId;

  /**
   * Person id
   */
  personId: ObjectId;

  /**
   * Relation type id
   */
  relationId: ObjectId;

  /**
   * Relation quote
   */
  quote?: MultilingualString | null;

  /**
   * Link to quote source
   */
  link?: MultilingualString | null;

  /**
   * Date of relation start
   */
  startDate?: string | null;

  /**
   * Date of relation end
   */
  endDate?: string | null;
}

/**
 * Represents a time range
 */
interface YearsRange {
  /**
   * Start point
   */
  gte: number;

  /**
   * End point
   */
  lte: number;
}

/**
 * Relation with additional data after its denormalization
 */
export interface DenormalizedRelation extends RelationDBScheme {
  /**
   * Years range of the relation
   */
  yearsRange: YearsRange;

  /**
   * Linked location instance data
   */
  locationInstance: LocationInstanceDBScheme;

  /**
   * Linked person data
   */
  person: PersonDBScheme;
}

const RelationMutations = {
  /**
   * Create new relation
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async create(
    parent: undefined,
    { input }: { input: CreateRelationInput },
    { db, tokenData, collection }: ResolverContextBase<true>
  ): Promise<CreateMutationPayload<RelationDBScheme>> {
    const relation = (await collection('relations').insertOne(input)).ops[0];

    await sendNotify('Relation', 'relations', db, tokenData, 'create', relation);

    return {
      recordId: relation._id,
      record: relation,
    };
  },

  /**
   * Update relation
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateRelationInput },
    { db, tokenData, collection }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<RelationDBScheme>> {
    const { id, ...rest } = input;
    const newInput = {
      _id: new ObjectId(id),
      ...rest,
    };

    const originalRelation = await collection('relations').findOne({
      _id: newInput._id,
    });

    if (!originalRelation) {
      throw new UserInputError('There is no relation with such id: ' + newInput._id);
    }

    await sendNotify('Relation', 'relations', db, tokenData, 'update', newInput, 'relations');

    const relation = await collection('relations').findOneAndUpdate(
      { _id: newInput._id },
      {
        $set: mergeWithCustomizer(originalRelation, newInput),
      },
      { returnOriginal: false });

    if (!relation.value) {
      throw new UserInputError('Can\'t update relation with such id: ' + newInput._id);
    }

    return {
      recordId: newInput._id,
      record: relation.value,
    };
  },

  /**
   * Delete relation
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async delete(
    parent: undefined,
    { id }: { id: ObjectId },
    { db, tokenData, collection }: ResolverContextBase<true>
  ): Promise<DeleteMutationPayload> {
    const originalRelation = await db.collection('relations').findOne({
      _id: id,
    });

    await sendNotify('Relation', 'relations', db, tokenData, 'delete', originalRelation);

    await collection('relations').deleteOne({ _id: id });

    return {
      recordId: id,
    };
  },
};

const Mutation = {
  relation: emptyMutation,
};

export default {
  Mutation,
  RelationMutations,
};
