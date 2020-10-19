import { ObjectId } from 'mongodb';
import { CreateMutationPayload, MultilingualString, ResolverContextBase } from '../types/graphql';
import { CreateRelationTypeInput } from '../generated/graphql';
import emptyMutation from '../utils/emptyMutation';

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
  synonyms: MultilingualString[];
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
    { collection }: ResolverContextBase
  ): Promise<CreateMutationPayload<RelationTypeDBScheme>> {
    const relationType = (await collection('relationtypes').insertOne(input)).ops[0];

    return {
      recordId: relationType._id,
      record: relationType,
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
