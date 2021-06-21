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
 * Completed quest counter by quest type
 * If type is undefined, returns count of completed quests
 *
 * @param type - quest type
 */
const completedQuestCounter = (type?: TaskTypes): AchievementValueResolver => {
  return async (parent, args, { tokenData, dataLoaders }): Promise<number> => {
    if (!tokenData || !('userId' in tokenData)) {
      return 0;
    }

    const user = await dataLoaders.userById.load(tokenData.userId);

    if (type === undefined) {
      return user?.completedQuestsIds?.length || 0;
    }

    if (!user || !user.completedQuestsIds || user.completedQuestsIds.length === 0) {
      return 0;
    }

    const quests = await dataLoaders.questById.loadMany(user.completedQuestsIds.map(questId => questId.toHexString()));

    const passedQuests = quests.filter(quest => quest && 'type' in quest && quest.type === type );

    return passedQuests.length;
  };
};

/**
 * Count passed distance for user
 *
 * @param parent - the object that contains the result returned from the resolver on the parent field
 * @param args - query args object
 * @param context - query context
 */
const distanceTraveledCounter: AchievementValueResolver = async (parent, args, { tokenData, dataLoaders }): Promise<number> => {
  if (!tokenData || !('userId' in tokenData)) {
    return 0;
  }

  const user = await dataLoaders.userById.load(tokenData.userId);

  if (!user || !user.completedQuestsIds || user.completedQuestsIds.length === 0) {
    return 0;
  }

  const quests = await dataLoaders.questById.loadMany(user.completedQuestsIds.map(questId => questId.toHexString()));

  let distance = 0;

  quests.forEach(quest => {
    if (quest && 'distanceInKilometers' in quest) {
      distance += quest.distanceInKilometers;
    }
  });

  return distance;
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
    currentValueResolver: completedQuestCounter(),
  },
  {
    _id: new ObjectId('60cc41a84eef47b6defd0a95'),
    name: {
      ru: 'Хорошо идём',
      en: 'Way to go',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 5,
    currentValueResolver: completedQuestCounter(),
  },
  {
    _id: new ObjectId('60cc41adae7a19dc6549fb2b'),
    name: {
      ru: 'Второстепенный персонаж',
      en: 'Minor character',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: completedQuestCounter(),
  },
  {
    _id: new ObjectId('60cc41b4f0715014851c9fc4'),
    name: {
      ru: 'Главный герой',
      en: 'Main character',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 20,
    currentValueResolver: completedQuestCounter(),
  },
  {
    _id: new ObjectId('60cc41ba322c17fd76d86851'),
    name: {
      ru: 'Легенда',
      en: 'Legend',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 30,
    currentValueResolver: completedQuestCounter(),
  },
  {
    _id: new ObjectId('60cc56ba322c17fd76d86851'),
    name: {
      ru: 'Успешный квинтет',
      en: 'Successful quintet',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 5,
    currentValueResolver: completedQuestCounter(TaskTypes.Quest),
  },
  {
    _id: new ObjectId('60cc41ba315c17fd76d86851'),
    name: {
      ru: 'Любитель приключений',
      en: 'Digital Adventurer',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: completedQuestCounter(TaskTypes.Quest),
  },
  {
    _id: new ObjectId('60cc41ba322c18ad76d86851'),
    name: {
      ru: 'Цифровой авантюрист',
      en: 'Knight of fortune',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 15,
    currentValueResolver: completedQuestCounter(TaskTypes.Quest),
  },
  {
    _id: new ObjectId('60cd41bd322c18ad76d86851'),
    name: {
      ru: 'Начинающий исследователь',
      en: 'Promising explorer',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 5,
    currentValueResolver: completedQuestCounter(TaskTypes.Route),
  },
  {
    _id: new ObjectId('60cd41bd321c18ad76d86851'),
    name: {
      ru: 'Дека-данс',
      en: 'Decade-dance',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: completedQuestCounter(TaskTypes.Route),
  },
  {
    _id: new ObjectId('60cd41bd324118ad76d86851'),
    name: {
      ru: 'Прожженный пешеход',
      en: 'Experienced pedestrian',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 20,
    currentValueResolver: completedQuestCounter(TaskTypes.Route),
  },
  {
    _id: new ObjectId('61ed41bd322c18ad76d86851'),
    name: {
      ru: 'Решала',
      en: 'The solver',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 5,
    currentValueResolver: completedQuestCounter(TaskTypes.Quiz),
  },
  {
    _id: new ObjectId('60cd41bd322c18ad67d86851'),
    name: {
      ru: 'Загадочный энтузиаст',
      en: 'Riddle enthusiast',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: completedQuestCounter(TaskTypes.Quiz),
  },
  {
    _id: new ObjectId('61ab41bd322c18ad67d86851'),
    name: {
      ru: 'Первые шаги',
      en: 'First Steps',
    },
    unit: AchievementUnits.Distance,
    requiredValue: 1,
    currentValueResolver: distanceTraveledCounter,
  },
  {
    _id: new ObjectId('61ab41bd322c18ad69d86851'),
    name: {
      ru: 'Любитель пеших прогулок',
      en: 'The walker',
    },
    unit: AchievementUnits.Distance,
    requiredValue: 5,
    currentValueResolver: distanceTraveledCounter,
  },
  {
    _id: new ObjectId('61ab41bd311c18ad67d86851'),
    name: {
      ru: 'Мечта урбаниста',
      en: 'Urbanist Dream',
    },
    unit: AchievementUnits.Distance,
    requiredValue: 10,
    currentValueResolver: distanceTraveledCounter,
  },
  {
    _id: new ObjectId('61ab41bd322c23ad67d86851'),
    name: {
      ru: 'Путешественник',
      en: 'The wanderer',
    },
    unit: AchievementUnits.Distance,
    requiredValue: 21,
    currentValueResolver: distanceTraveledCounter,
  },
  {
    _id: new ObjectId('61ab41ab322c18ad67d86851'),
    name: {
      ru: 'Фидиппид нашего времени',
      en: 'Pheidippides',
    },
    unit: AchievementUnits.Distance,
    requiredValue: 42,
    currentValueResolver: distanceTraveledCounter,
  },
];

const Query = {
  achievements: (): Achievement[] => achievementsArray,
};

export default {
  Query,
  Achievement: AchievementResolver,
};
