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
  locationId: ObjectId;

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
  quote: MultilingualString;
}

export interface RelationTypeDBScheme {
  _id: ObjectId;
  name: MultilingualString;
  synonyms: [RelationSynonymDBScheme];
}

export interface RelationSynonymDBScheme {
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
      const relationType = await dataLoaders.relationTypeById.load(relation.relationId.toString());

      if (!relationType) {
        return null;
      }

      filterEntityFields(relationType, languages, multilingualRelationTypeFields);

      return relationType;
    }
  }
};
