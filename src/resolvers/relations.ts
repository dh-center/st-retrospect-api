import { ObjectId } from 'mongodb';
import { MultilingualString } from '../types/graphql';
import { Location } from './locations';
import { Person } from './persons';

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
