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
  synonyms: [RelationSynonymDBScheme];
}

/**
 * Relation type synonym representation
 */
export interface RelationSynonymDBScheme {
  /**
   * Synonym name
   */
  name: MultilingualString;
}

const RelationMutations = {
  /**
   * Create new relation
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - relation object
   * @param collection - collection in MongoDB for queries
   */
  async create(
    parent: undefined,
    { input }: { input: CreateRelationInput },
    { collection }: ResolverContextBase
  ): Promise<CreateMutationPayload<RelationDBScheme>> {
    const relation = (await collection('relations').insertOne(input)).ops[0];

    return {
      recordId: relation._id,
      record: relation,
    };
  },

  /**
   * Update relation
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - relation object
   * @param collection - collection in MongoDB for queries
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateRelationInput & {_id: ObjectId} },
    { collection }: ResolverContextBase
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
   * @param id - relation id
   * @param collection - collection in MongoDB for queries
   */
  async delete(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection }: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
    await collection('relations').deleteOne({ _id: id });

    return {
      recordId: id,
    };
  },
};

const RelationType = {
  /**
   * Resolver for relation type synonyms
   *
   * @param relation - the object that contains the result returned from the resolver on the parent field
   */
  synonyms(
    relation: RelationTypeDBScheme
  ): (MultilingualString | null)[] {
    return relation.synonyms.map((synonym) => {
      if (!synonym) {
        return null;
      }

      return synonym.name;
    });
  },
};

const Mutation = {
  relation: emptyMutation,
};

export default {
  RelationType,
  Mutation,
  RelationMutations,
};
