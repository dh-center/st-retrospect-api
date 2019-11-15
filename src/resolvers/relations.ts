import { ObjectId } from 'mongodb';
import { MultilingualString, ResolverContextBase } from '../types/graphql';
import {Location, LocationDBScheme, multilingualLocationFields} from './locations';
import { multilingualPersonFields, Person } from './persons';
import { filterEntityFields } from '../utils';

/**
 * Multilingual relation fields
 */
export const multilingualRelationFields = [
  'quote'
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
   * Relation quote
   */
  quote: MultilingualString;
}

export interface RelationGraphQLScheme {
  /**
   * Relation id
   */
  id: ObjectId | string;

  /**
   * Linked location
   */
  location: Location;

  /**
   * Linked person
   */
  person: Person;

  /**
   * Relation quote
   */
  quote: MultilingualString;
}

/**
 * Type with fields from both GraphQL and database schemas
 */
export type MixedRelation = RelationGraphQLScheme & RelationDbScheme;

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
    }
  }
};
