import { ObjectId } from 'mongodb';
import {
  CreateMutationPayload,
  DeleteMutationPayload,
  MultilingualString,
  ResolverContextBase, UpdateMutationPayload
} from '../types/graphql';
import mergeWith from 'lodash.mergewith';
import emptyMutation from '../utils/emptyMutation';
import { CreateRelationInput, UpdateRelationInput } from '../generated/graphql';
import { UserInputError } from 'apollo-server-express';
import sendNotify from '../utils/telegramNotify';

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
  locationInstanceId: ObjectId | null;

  /**
   * Person id
   */
  personId: ObjectId | null;

  /**
   * Relation type id
   */
  relationId: ObjectId | null;

  /**
   * Relation quote
   */
  quote: MultilingualString;
}

const RelationMutations = {
  /**
   * Create new relation
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input.input
   * @param input - relation object
   * @param collection.db
   * @param collection - collection in MongoDB for queries
   * @param collection.user
   * @param collection.collection
   */
  async create(
    parent: undefined,
    { input }: { input: CreateRelationInput },
    { db, user, collection }: ResolverContextBase
  ): Promise<CreateMutationPayload<RelationDBScheme>> {
    const relation = (await collection('relations').insertOne(input)).ops[0];

    await sendNotify('Relation', 'relations', db, user, 'create', input);

    return {
      recordId: relation._id,
      record: relation,
    };
  },

  /**
   * Update relation
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input.input
   * @param input - relation object
   * @param collection.db
   * @param collection - collection in MongoDB for queries
   * @param collection.user
   * @param collection.collection
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateRelationInput & {_id: ObjectId} },
    { db, user, collection }: ResolverContextBase
  ): Promise<UpdateMutationPayload<RelationDBScheme>> {
    input._id = new ObjectId(input.id);
    const id = input._id;

    delete input.id;

    const originalRelation = await collection('relations').findOne({
      _id: id,
    });

    if (!originalRelation) {
      throw new UserInputError('There is no relation with such id: ' + id);
    }

    await sendNotify('Relation', 'relations', db, user, 'update', input, 'relations');

    const relation = await collection('relations').findOneAndUpdate(
      { _id: id },
      {
        $set: mergeWith(originalRelation, input, (original, inp) => inp === null ? original : undefined),
      },
      { returnOriginal: false });

    if (!relation.value) {
      throw new UserInputError('Can\'t update relation with such id: ' + id);
    }

    return {
      recordId: id,
      record: relation.value,
    };
  },

  /**
   * Delete relation
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id.id
   * @param id - relation id
   * @param collection.db
   * @param collection - collection in MongoDB for queries
   * @param collection.user
   * @param collection.collection
   */
  async delete(
    parent: undefined,
    { id }: { id: ObjectId },
    { db, user, collection }: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
    const originalRelation = await db.collection('relations').findOne({
      _id: id,
    });

    await sendNotify('Relation', 'relations', db, user, 'delete', originalRelation);

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
