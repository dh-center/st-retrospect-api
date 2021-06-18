import { AchievementUnits, TaskTypes } from '../generated/graphql';
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
  currentValue(parent: Achievement, args: undefined, context: ResolverContextBase): Promise<number> {
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

/**
 * Returns number of passed quests with type QUEST for user
 *
 * @param parent - the object that contains the result returned from the resolver on the parent field
 * @param args - query args object
 * @param context - query context
 */
const completedQuestTypeQuestCountResolver: AchievementValueResolver = async (parent, args, { tokenData, dataLoaders }) => {
  if (!tokenData || !('userId' in tokenData)) {
    return 0;
  }

  const user = await dataLoaders.userById.load(tokenData.userId);

  if (!user || !user.completedQuestsIds || user.completedQuestsIds.length === 0) {
    return 0;
  }

  const quests = await dataLoaders.questById.loadMany(user.completedQuestsIds.map(questId => questId.toHexString()));

  const passedQuests = quests.filter(quest => quest && 'type' in quest && quest.type === TaskTypes.Quest );

  return passedQuests.length;
};

/**
 * Returns number of passed quests with type ROUTE for user
 *
 * @param parent - the object that contains the result returned from the resolver on the parent field
 * @param args - query args object
 * @param context - query context
 */
const completedQuestTypeRouteCountResolver: AchievementValueResolver = async (parent, args, { tokenData, dataLoaders }) => {
  if (!tokenData || !('userId' in tokenData)) {
    return 0;
  }

  const user = await dataLoaders.userById.load(tokenData.userId);

  if (!user || !user.completedQuestsIds || user.completedQuestsIds.length === 0) {
    return 0;
  }

  const quests = await dataLoaders.questById.loadMany(user.completedQuestsIds.map(questId => questId.toHexString()));

  const passedQuests = quests.filter(quest => quest && 'type' in quest && quest.type === TaskTypes.Route );

  return passedQuests.length;
};

/**
 * Returns number of passed quests with type QUIZ for user
 *
 * @param parent - the object that contains the result returned from the resolver on the parent field
 * @param args - query args object
 * @param context - query context
 */
const completedQuestTypeQuizCountResolver: AchievementValueResolver = async (parent, args, { tokenData, dataLoaders }) => {
  if (!tokenData || !('userId' in tokenData)) {
    return 0;
  }

  const user = await dataLoaders.userById.load(tokenData.userId);

  if (!user || !user.completedQuestsIds || user.completedQuestsIds.length === 0) {
    return 0;
  }

  const quests = await dataLoaders.questById.loadMany(user.completedQuestsIds.map(questId => questId.toHexString()));

  const passedQuests = quests.filter(quest => quest && 'type' in quest && quest.type === TaskTypes.Quiz );

  return passedQuests.length;
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
  {
    _id: new ObjectId('60cc56ba322c17fd76d86851'),
    name: {
      ru: 'Успешный квинтет',
      en: 'Successful quintet',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 5,
    currentValueResolver: completedQuestTypeQuestCountResolver,
  },
  {
    _id: new ObjectId('60cc41ba315c17fd76d86851'),
    name: {
      ru: 'Любитель приключений',
      en: 'Digital Adventurer',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: completedQuestTypeQuestCountResolver,
  },
  {
    _id: new ObjectId('60cc41ba322c18ad76d86851'),
    name: {
      ru: 'Цифровой авантюрист',
      en: 'Knight of fortune',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 15,
    currentValueResolver: completedQuestTypeQuestCountResolver,
  },
  {
    _id: new ObjectId('60cd41bd322c18ad76d86851'),
    name: {
      ru: 'Начинающий исследователь',
      en: 'Promising explorer',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 5,
    currentValueResolver: completedQuestTypeRouteCountResolver,
  },
  {
    _id: new ObjectId('60cd41bd321c18ad76d86851'),
    name: {
      ru: 'Дека-данс',
      en: 'Decade-dance',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: completedQuestTypeRouteCountResolver,
  },
  {
    _id: new ObjectId('60cd41bd324118ad76d86851'),
    name: {
      ru: 'Прожженный пешеход',
      en: 'Experienced pedestrian',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 20,
    currentValueResolver: completedQuestTypeRouteCountResolver,
  },
  {
    _id: new ObjectId('61ed41bd322c18ad76d86851'),
    name: {
      ru: 'Решала',
      en: 'The solver',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 5,
    currentValueResolver: completedQuestTypeQuizCountResolver,
  },
  {
    _id: new ObjectId('60cd41bd322c18ad67d86851'),
    name: {
      ru: 'Загадочный энтузиаст',
      en: 'Riddle enthusiast',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: completedQuestTypeQuizCountResolver,
  },
];

const Query = {
  achievements: (): Achievement[] => achievementsArray,
};

export default {
  Query,
  Achievement: AchievementResolver,
};
