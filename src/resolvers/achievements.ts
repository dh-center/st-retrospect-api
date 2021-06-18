import { AchievementUnits } from '../generated/graphql';
import { ObjectId } from 'mongodb';
import { MultilingualString, ResolverContextBase } from '../types/graphql';

type AchievementValueResolver = (parent: Achievement, args: undefined, context: ResolverContextBase) => Promise<number>;

/**
 * Database representation for achievement
 */
export interface Achievement {
  /**
   * Achievement identifier
   */
  _id: ObjectId;

  /**
   * Achievement name
   */
  name: MultilingualString;

  /**
   * Unit of measure in which the value is calculated
   */
  unit: AchievementUnits;

  /**
   *  Function, that resolves current value reached by the user
   */
  currentValueResolver: AchievementValueResolver;

  /**
   * The value you need to get the achievement
   */
  requiredValue: number;
}

const AchievementResolver = {
  /**
   * Returns current value for authed user
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param args - query args object
   * @param context - query context
   */
  currentValue(parent: Achievement, args: undefined, context: ResolverContextBase) {
    return parent.currentValueResolver(parent, args, context);
  },
};

/**
 * Returns number of passed quest for user
 *
 * @param parent - the object that contains the result returned from the resolver on the parent field
 * @param args - query args object
 * @param context - query context
 */
const completedQuestCountResolver: AchievementValueResolver = async (parent, args, { tokenData, dataLoaders }) => {
  if (!tokenData || !('userId' in tokenData)) {
    return 0;
  }

  const user = await dataLoaders.userById.load(tokenData.userId);

  return user?.completedQuestsIds?.length || 0;
};

export const achievementsArray: Achievement[] = [
  {
    _id: new ObjectId('60cc36d4b5a18a0f0815d77a'),
    name: {
      ru: 'Начало положено',
      en: 'Smooth start',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 1,
    currentValueResolver: completedQuestCountResolver,
  },
  {
    _id: new ObjectId('60cc41a84eef47b6defd0a95'),
    name: {
      ru: 'Хорошо идём',
      en: 'Way to go',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 5,
    currentValueResolver: completedQuestCountResolver,
  },
  {
    _id: new ObjectId('60cc41adae7a19dc6549fb2b'),
    name: {
      ru: 'Второстепенный персонаж',
      en: 'Minor character',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: completedQuestCountResolver,
  },
  {
    _id: new ObjectId('60cc41b4f0715014851c9fc4'),
    name: {
      ru: 'Главный герой',
      en: 'Main character',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 20,
    currentValueResolver: completedQuestCountResolver,
  },
  {
    _id: new ObjectId('60cc41ba322c17fd76d86851'),
    name: {
      ru: 'Легенда',
      en: 'Legend',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 30,
    currentValueResolver: completedQuestCountResolver,
  },
];

const Query = {
  achievements: (): Achievement[] => achievementsArray,
};

export default {
  Query,
  Achievement: AchievementResolver,
};
