import { ObjectId } from 'mongodb';
import { MultilingualString, ResolverContextBase } from '../types/graphql';
import { LocationDBScheme, multilingualLocationFields } from './locations';
import { multilingualPersonFields, Person } from './persons';
import { filterEntityFields } from '../utils';

/**
 * Multilingual relation fields
 */
export const multilingualRelationFields = [
  'quote'
];

/**
 * Multilingual relation type fields
 */
export const multilingualRelationTypeFields = [
  'name'
];

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
     * @param languages - languages in which return data
     */
    async person(
      relation: RelationDbScheme,
      _args: {},
      { dataLoaders, languages }: ResolverContextBase
    ): Promise<Person | null> {
      if (!relation.personId) {
        return null;
      }

      const person = await dataLoaders.personById.load(relation.personId.toString());

      if (!person) {
        return null;
      }

      filterEntityFields(person, languages, multilingualPersonFields);

      return person;
    },

    /**
     * Resolver for relation's person
     * @param relation - the object that contains the result returned from the resolver on the parent field
     * @param _args - empty args list
     * @param dataLoaders - DataLoaders for fetching data
     * @param languages - languages in which return data
     */
    async location(
      relation: RelationDbScheme,
      _args: {},
      { dataLoaders, languages }: ResolverContextBase
    ): Promise<LocationDBScheme | null> {
      if (!relation.locationId) {
        return null;
      }

      const location = await dataLoaders.locationById.load(relation.locationId.toString());

      if (!location) {
        return null;
      }

      filterEntityFields(location, languages, multilingualLocationFields);

      return location;
    },

    /**
     * Resolver for relation's type
     * @param relation - the object that contains the result returned from the resolver on the parent field
     * @param _args - empty args list
     * @param dataLoaders - DataLoaders for fetching data
     * @param languages - languages in which return data
     */
    async relationType(
      relation: RelationDbScheme,
      _args: {},
      { dataLoaders, languages }: ResolverContextBase
    ): Promise<RelationTypeDBScheme | null> {
      if (!relation.relationId) {
        return null;
      }

      const relationType = await dataLoaders.relationTypeById.load(relation.relationId.toString());

      if (!relationType) {
        return null;
      }

      filterEntityFields(relationType, languages, multilingualRelationTypeFields);

      return relationType;
    }
  },
  RelationType: {
    /**
     * Resolver for relation type synonyms
     * @param relation - the object that contains the result returned from the resolver on the parent field
     * @param _args - empty args list
     * @param dataLoaders - DataLoaders for fetching data
     * @param languages - languages in which return data
     */
    synonyms(
      relation: RelationTypeDBScheme,
      _args: {},
      { languages }: ResolverContextBase
    ): (MultilingualString | null)[] {
      return relation.synonyms.map((synonym) => {
        if (!synonym) {
          return null;
        }

        filterEntityFields(synonym, languages, multilingualRelationTypeFields);
        return synonym.name;
      });
    }
  }
};
