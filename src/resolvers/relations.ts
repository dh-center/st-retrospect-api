import { ObjectId } from 'mongodb';
import { CreateMutationPayload, MultilingualString, ResolverContextBase } from '../types/graphql';
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
   * @param db - MongoDB connection to make queries
   */
  async create(
    parent: undefined,
    { input }: { input: RelationDBScheme },
    { db }: ResolverContextBase
  ): Promise<CreateMutationPayload<RelationDBScheme>> {
    const relation = (await db.collection<RelationDBScheme>('relations').insertOne(input)).ops[0];

    return {
      recordId: relation._id,
      record: relation,
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
  relation: (): Record<string, undefined> => ({}),
};

export default {
  RelationType,
  Mutation,
  RelationMutations,
};
