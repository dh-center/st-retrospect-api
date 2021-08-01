import {
  CreateMutationPayload,
  DeleteMutationPayload,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { ObjectId } from 'mongodb';
import { EditorData } from '../types/editorData';
import emptyMutation from '../utils/emptyMutation';
import sendNotify from '../utils/telegramNotify';
import {
  Application,
  Languages,
  QuestUserProgressStates,
  TaskTypes,
  UpdateQuestInput,
  WayToTravel
} from '../generated/graphql';
import mergeWithCustomizer from '../utils/mergeWithCustomizer';
import { UserInputError } from 'apollo-server-express';
import { ExpiredAccessToken, InvalidAccessToken } from '../errorTypes';
import getUserLevel from '../utils/getUserLevel';
import { LocationInstanceDBScheme } from './locations';
import { fromGlobalId } from '../utils/globalId';

/**
 * Scheme of quest in database
 */
export interface QuestDBScheme {
  /**
   * Id of quest
   */
  _id: ObjectId;

  /**
   * Quest name
   */
  name: string;

  /**
   * Quest description
   */
  description: string;

  /**
   * Quest content language
   */
  language: Languages;

  /**
   * What user needs to use for route passing
   */
  wayToTravel: WayToTravel;

  /**
   * Where quest will be displayed
   */
  whereDisplays: Application[];

  /**
   * Quest duration in minutes
   */
  durationInMinutes: number;

  /**
   * Quest distance in kilometers
   */
  distanceInKilometers: number;

  /**
   * Quest photo
   */
  photo: string;

  /**
   * Quest type
   */
  type: TaskTypes;

  /**
   * Quest progress states
   */
  questProgressState: QuestUserProgressStates;

  /**
   * The minimum level required by the user to complete this quest
   */
  minLevel: number;

  /**
   * The experience that the user will receive by completing this quest
   */
  earnedExp: number;

  /**
   * Quest data
   */
  data?: EditorData;

  /**
   * Information about quest authors
   */
  credits?: EditorData;

  /**
   * Quest tags
   */
  tagIds?: ObjectId[] | null;

  /**
   * Cards ids that user will get after quest passing
   */
  personsCardsIds?: ObjectId[];
}

const Query = {
  /**
   * Returns specific quest
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - quest id
   * @param db - MongoDB connection to make queries
   */
  async quest(parent: undefined, { id }: { id: string }, { dataLoaders }: ResolverContextBase): Promise<QuestDBScheme | null> {
    const quest = dataLoaders.questById.load(id);

    if (!quest) {
      return null;
    }

    return quest;
  },
};

const QuestMutations = {
  /**
   * Create new quest
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - mutation input object
   * @param db - MongoDB connection to make queries
   */
  async create(
    parent: undefined,
    { input }: { input: QuestDBScheme },
    { db, tokenData }: ResolverContextBase<true>
  ): Promise<CreateMutationPayload<QuestDBScheme>> {
    const quest = (await db.collection<QuestDBScheme>('quests').insertOne(input)).ops[0];

    await sendNotify('Quest', 'quests', db, tokenData, 'create', input);

    return {
      recordId: quest._id,
      record: quest,
    };
  },

  /**
   * Update quest
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - mutation input object
   * @param context - resolver context
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateQuestInput },
    { db, tokenData }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<QuestDBScheme>> {
    const { id, ...rest } = input;
    const newInput = {
      _id: new ObjectId(id),
      ...rest,
    };

    const originalQuest = await db.collection('quests').findOne({
      _id: newInput._id,
    });

    await sendNotify('Quest', 'quests', db, tokenData, 'update', newInput, 'quests');

    const quest = await db.collection('quests').findOneAndUpdate(
      { _id: newInput._id },
      {
        $set: {
          ...mergeWithCustomizer(originalQuest, newInput),
          ...(newInput.data ? { data: newInput.data } : {}),
          ...(newInput.credits ? { credits: newInput.credits } : {}),
        },
      },
      { returnOriginal: false });

    return {
      recordId: newInput._id,
      record: quest.value,
    };
  },

  /**
   * Delete quest
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - object id
   * @param db - MongoDB connection to make queries
   */
  async delete(
    parent: undefined,
    { id }: { id: string },
    { db, tokenData }: ResolverContextBase<true>
  ): Promise<DeleteMutationPayload> {
    const originalQuest = await db.collection('quests').findOne({
      _id: id,
    });

    await sendNotify('Quest', 'quests', db, tokenData, 'delete', originalQuest);

    await db.collection<QuestDBScheme>('quests').deleteOne({ _id: new ObjectId(id) });

    return {
      recordId: new ObjectId(id),
    };
  },
};

const Quest = {
  /**
   * Return quest progress state
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async questProgressState(
    parent: QuestDBScheme,
    args: undefined,
    { collection, tokenData }: ResolverContextBase<true>
  ): Promise<QuestUserProgressStates> {
    if (!tokenData) {
      return QuestUserProgressStates.Locked;
    }

    if ('errorName' in tokenData) {
      throw new ExpiredAccessToken();
    }

    const currentUser = await collection('users').findOne({ _id: new ObjectId(tokenData.userId) });
    const quest = await collection('quests').findOne({ _id: parent._id });

    if (!quest) {
      throw new UserInputError('There is no quest with such id: ' + parent._id);
    }
    if (!currentUser) {
      throw new InvalidAccessToken();
    }

    const isAlreadyCompleted = currentUser.completedQuestsIds?.some(id => id.toString() === parent._id.toString());

    if (isAlreadyCompleted) {
      return QuestUserProgressStates.Passed;
    } else {
      return getUserLevel(currentUser.exp) < quest.minLevel ? QuestUserProgressStates.Locked : QuestUserProgressStates.Available;
    }
  },

  /**
   * Returns location instances that are present in the quest
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async locationInstances(
    parent: QuestDBScheme,
    args: undefined,
    { dataLoaders }: ResolverContextBase
  ): Promise<LocationInstanceDBScheme[]> {
    const locationInstancesIds = parent.data?.blocks
      .filter(block => block.type === 'locationInstance' && typeof block.data.locationInstanceId === 'string')
      .map(block => fromGlobalId(block.data.locationInstanceId as string).id);

    if (!locationInstancesIds || !locationInstancesIds.length) {
      return [];
    }

    return (await dataLoaders.locationInstanceById.loadMany(locationInstancesIds))
      .filter((loc): loc is LocationInstanceDBScheme => !!loc);
  },

  /**
   * Returns the likelihood that the user will like this quest (rating based on a recommendation system)
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async recommendationScore(
    parent: QuestDBScheme,
    args: undefined,
    { dataLoaders, tokenData }: ResolverContextBase<true>
  ): Promise<number> {
    const user = await dataLoaders.userById.load(tokenData.userId);

    if (!user) {
      throw new InvalidAccessToken();
    }

    const passedQuestsIds = user.completedQuestsIds?.map(id => id.toString()) || [];

    if (!passedQuestsIds.length) {
      return 0;
    }

    const passesQuests = await dataLoaders.questById.loadMany(passedQuestsIds);

    const tagsWithScore = passesQuests
      .filter((quest): quest is QuestDBScheme => !!quest)
      .reduce(
        (acc, val) => {
          const tagIds = (val.tagIds || []).map(id => id.toString());

          tagIds.forEach(tag => {
            const accValue = acc[tag];

            if (!accValue) {
              acc[tag] = 1;
            } else {
              acc[tag] = accValue + 1;
            }
          });

          return acc;
        },
        {} as Record<string, number | undefined>
      );

    return parent.tagIds?.reduce((acc, tag) => {
      const tagScore = tagsWithScore[tag.toString()] || 0;

      return acc + tagScore;
    }, 0) || 0;
  },
};

const Mutation = {
  quest: emptyMutation,
};

export default {
  Query,
  Mutation,
  QuestMutations,
  Quest,
};
