import { ObjectId } from 'mongodb';
import { MultilingualString } from '../types/graphql';

/**
 * Multilingual relation fields
 */
export const multilingualRelationFields = [
  'quote'
];

export interface RelationDbScheme {
  _id: ObjectId;

  locationId: ObjectId;

  personId: ObjectId;

  quote: MultilingualString;
}
