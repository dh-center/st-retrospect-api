import { ObjectId } from 'mongodb';
import { MultilingualString, ResolverContextBase } from '../types/graphql';
import { LocationDBScheme } from './locations';
import { PersonDBScheme } from './persons';

/**
 * Relation's database scheme
 */
export interface RelationDbScheme {
  /**
   * Relation id
   */
  _id: ObjectId;

  /**
   * Location id
   */
  locationId: ObjectId | null;

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
  Relation: {
    /**
     * Resolver for relation's person
     * @param relation - the object that contains the result returned from the resolver on the parent field
     * @param _args - empty args list
     * @param dataLoaders - DataLoaders for fetching data
     */
    async person(
      relation: RelationDbScheme,
      _args: {},
      { dataLoaders }: ResolverContextBase
    ): Promise<PersonDBScheme | null> {
      if (!relation.personId) {
        return null;
      }

      const person = await dataLoaders.personById.load(relation.personId.toString());

      if (!person) {
        return null;
      }

      return person;
    },

    /**
     * Resolver for relation's person
     * @param relation - the object that contains the result returned from the resolver on the parent field
     * @param _args - empty args list
     * @param dataLoaders - DataLoaders for fetching data
     */
    async location(
      relation: RelationDbScheme,
      _args: {},
      { dataLoaders }: ResolverContextBase
    ): Promise<LocationDBScheme | null> {
      if (!relation.locationId) {
        return null;
      }

      const location = await dataLoaders.locationById.load(relation.locationId.toString());

      if (!location) {
        return null;
      }

      return location;
    },

    /**
     * Resolver for relation's type
     * @param relation - the object that contains the result returned from the resolver on the parent field
     * @param _args - empty args list
     * @param dataLoaders - DataLoaders for fetching data
     */
    async relationType(
      relation: RelationDbScheme,
      _args: {},
      { dataLoaders }: ResolverContextBase
    ): Promise<RelationTypeDBScheme | null> {
      if (!relation.relationId) {
        return null;
      }

      const relationType = await dataLoaders.relationTypeById.load(relation.relationId.toString());

      if (!relationType) {
        return null;
      }

      return relationType;
    }
  },
  RelationType: {
    /**
     * Resolver for relation type synonyms
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
    }
  }
};
