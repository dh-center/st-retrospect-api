import { ObjectId } from 'mongodb';
import { MultilingualString } from '../types/graphql';

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

export default {
  RelationType: {
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
  },
};
