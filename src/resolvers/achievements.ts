import { AchievementUnits, TaskTypes } from '../generated/graphql';
import { ObjectId } from 'mongodb';
import { MultilingualString, ResolverContextBase } from '../types/graphql';
import { QuestDBScheme } from './quests';
import { PersonDBScheme } from './persons';

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

/**
 * Counter of received cards by tag id
 *
 * @param tagId - tag id for search
 */
const receivedCardsCounter = (tagId: string | undefined): AchievementValueResolver => {
  return async (parent, args, { tokenData, dataLoaders }): Promise<number> => {
    if (!tokenData || !('userId' in tokenData)) {
      return 0;
    }

    const user = await dataLoaders.userById.load(tokenData.userId);

    if (!user || !user.completedQuestsIds || user.completedQuestsIds.length === 0) {
      return 0;
    }

    const quests = (await dataLoaders.questById
      .loadMany(user.completedQuestsIds.map(questId => questId.toHexString())))
      .filter((quest): quest is QuestDBScheme => !!quest && 'personsCardsIds' in quest);

    const personIds = quests
      .map(quest => quest.personsCardsIds)
      .flat()
      .filter((personId): personId is ObjectId => !!personId);

    if (tagId === undefined) {
      return personIds.length;
    }

    const persons = (await dataLoaders.personById
      .loadMany(personIds.map(personId => personId.toHexString())))
      .filter((person): person is PersonDBScheme => !!person && 'tagIds' in person);

    const tag = new ObjectId(tagId);

    return persons.filter(person => person.tagIds?.includes(tag)).length;
  };
};

/**
 * Counter of passed quests by tag id
 *
 * @param tagId - tag id for search
 */
const passedQuestsByTagCounter = (tagId: string): AchievementValueResolver => {
  return async (parent, args, { tokenData, dataLoaders }): Promise<number> => {
    if (!tokenData || !('userId' in tokenData)) {
      return 0;
    }

    const user = await dataLoaders.userById.load(tokenData.userId);

    if (!user || !user.completedQuestsIds || user.completedQuestsIds.length === 0) {
      return 0;
    }

    const quests = (await dataLoaders.questById
      .loadMany(user.completedQuestsIds.map(questId => questId.toHexString())))
      .filter((quest): quest is QuestDBScheme => !!quest && '_id' in quest);

    const tag = new ObjectId(tagId);

    return quests.filter(quest => quest.tagIds?.includes(tag)).length;
  };
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
  {
    _id: new ObjectId('61ab41cf322c18ad67d86851'),
    name: {
      ru: 'Зачин',
      en: 'Inception',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: receivedCardsCounter('60927089cc8d22a1c2f89060'), // Literature
  },
  {
    _id: new ObjectId('61ab43cf322c18ad67d86851'),
    name: {
      ru: 'Лучший ученик',
      en: 'Best Student',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 20,
    currentValueResolver: receivedCardsCounter('60927089cc8d22a1c2f89060'), // Literature
  },
  {
    _id: new ObjectId('61acd1cf322c18ad67d86851'),
    name: {
      ru: 'Книжный червь',
      en: 'Bookworm',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 30,
    currentValueResolver: receivedCardsCounter('60927089cc8d22a1c2f89060'), // Literature
  },
  {
    _id: new ObjectId('61ab41cf322c18a2ac186851'),
    name: {
      ru: 'Друг писателей',
      en: 'Writer’s friend',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 40,
    currentValueResolver: receivedCardsCounter('60927089cc8d22a1c2f89060'), // Literature
  },
  {
    _id: new ObjectId('61ab22cf322c18a2ac186851'),
    name: {
      ru: 'Подмастерье',
      en: 'Apprentice',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: receivedCardsCounter('6092704ccc8d22bfb6f8905e'), // Art
  },
  {
    _id: new ObjectId('601041cf322c18a2ac186851'),
    name: {
      ru: 'Вторая скрипка',
      en: 'Second violin',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: receivedCardsCounter('6092703fcc8d221862f8905d'), // Music
  },
  {
    _id: new ObjectId('61ab41cf322c48a2ac186851'),
    name: {
      ru: 'Градоначальник',
      en: 'City counselor',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 10,
    currentValueResolver: receivedCardsCounter('609270a0cc8d22f922f89061'), // Politics
  },
  {
    _id: new ObjectId('61ab41cf331c48a2ac186851'),
    name: {
      ru: 'Первый неклассический',
      en: 'First non-classical',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 5,
    currentValueResolver: passedQuestsByTagCounter('60cb645229ada6282e1d4bf8'), // ITMO
  },
  {
    _id: new ObjectId('61ab41cf332c48a2ac186851'),
    name: {
      ru: 'Библиотекарь',
      en: 'The librarian',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 9,
    currentValueResolver: passedQuestsByTagCounter('60927089cc8d22a1c2f89060'), // Literature
  },
  {
    _id: new ObjectId('61ab41cf332c47a2ac186851'),
    name: {
      ru: 'Дневной гуляка',
      en: 'The Good-liver',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 1,
    currentValueResolver: passedQuestsByTagCounter('60ccf8106854908f93b6d852'), // Carouse
  },
  {
    _id: new ObjectId('61ab41cf332c47a2aa186851'),
    name: {
      ru: 'Дневной гуляка',
      en: 'The Good-liver',
    },
    unit: AchievementUnits.Quantity,
    requiredValue: 3,
    currentValueResolver: passedQuestsByTagCounter('60d2511f82e272c6edfa2d33'), // Revolution
  },
];

const Query = {
  achievements: (): Achievement[] => achievementsArray,
};

export default {
  Query,
  Achievement: AchievementResolver,
};
