import { ObjectId } from 'mongodb';
import { MultilingualString } from '../types/graphql';

/**
 * Tag scheme in database
 */
export interface TagDBScheme {
  /**
   * Tag id in database
   */
  _id: ObjectId;

  /**
   * Tag value
   */
  value: MultilingualString;
}
