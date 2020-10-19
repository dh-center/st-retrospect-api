import { ObjectId } from 'mongodb';
import { CreateMutationPayload, MultilingualString, ResolverContextBase } from '../types/graphql';
// import { CreateRelationTypeInput } from '../generated/graphql';

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

// const RelationTypeMutations = {
//   /**
//    * Creates new relation type
//    *
//    * @param parent - the object that contains the result returned from the resolver on the parent field
//    * @param input - relation object
//    * @param collection - collection in MongoDB for queries
//    */
//   async create(
//     parent: undefined,
//     { input }: { input: CreateRelationTypeInput },
//     { collection }: ResolverContextBase
//   ): Promise<CreateMutationPayload<RelationTypeDBScheme>> {
//     const relationType = (await collection('relationtypes').insertOne(input)).ops[0];
//
//     return {
//       recordId: relationType._id,
//       record: relationType,
//     };
//   },
// };

export default {
  RelationType,
};
