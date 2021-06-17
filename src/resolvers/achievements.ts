import { AchievementUnits } from '../generated/graphql';
import { ObjectId } from 'mongodb';

/**
 * Database representation for achievement
 */
export interface AchievementDBScheme {
  /**
   * Achievement identifier
   */
  _id: ObjectId;

  /**
   * Achievement name
   */
  name: string;

  /**
   * Unit of measure in which the value is calculated
   */
  unit: AchievementUnits;

  /**
   *  Current value reached by the user
   */
  currentValue: number;

  /**
   * The value you need to get the achievement
   */
  requiredValue: number;
}
