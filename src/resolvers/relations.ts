import { ObjectId } from 'mongodb';
import { MultilingualString, ResolverContextBase } from '../types/graphql';
import { Location } from './locations';
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
    async person(
      relation: RelationDbScheme,
      _args: {},
      { dataLoaders, languages }: ResolverContextBase
    ): Promise<Person> {
      const person = await dataLoaders.personsByIds.load(relation.personId.toString());

      filterEntityFields(person, languages, multilingualPersonFields);

      return person;
    }
  }
};
