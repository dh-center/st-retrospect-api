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
import { QuestUserProgressStates, TaskTypes, UpdateQuestInput } from '../generated/graphql';
import mergeWithCustomizer from '../utils/mergeWithCustomizer';
import { UserInputError } from 'apollo-server-express';
import { InvalidAccessToken } from '../errorTypes';

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
    { db, user }: ResolverContextBase
  ): Promise<CreateMutationPayload<QuestDBScheme>> {
    const quest = (await db.collection<QuestDBScheme>('quests').insertOne(input)).ops[0];

    await sendNotify('Quest', 'quests', db, user, 'create', input);

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
    { db, user }: ResolverContextBase
  ): Promise<UpdateMutationPayload<QuestDBScheme>> {
    const { id, ...rest } = input;
    const newInput = {
      _id: new ObjectId(id),
      ...rest,
    };

    const originalQuest = await db.collection('quests').findOne({
      _id: newInput._id,
    });

    await sendNotify('Quest', 'quests', db, user, 'update', newInput, 'quests');

    const quest = await db.collection('quests').findOneAndUpdate(
      { _id: newInput._id },
      {
        $set: {
          ...mergeWithCustomizer(originalQuest, newInput),
          ...(newInput.data ? { data: newInput.data } : {}),
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
    { db, user }: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
    const originalQuest = await db.collection('quests').findOne({
      _id: id,
    });

    await sendNotify('Quest', 'quests', db, user, 'delete', originalQuest);

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
    { collection, user }: ResolverContextBase
  ): Promise<string> {
    const currentUser = await collection('users').findOne({ _id: new ObjectId(user.id) });
    const quest = await collection('quests').findOne({ _id: parent._id });

    if (!quest) {
      throw new UserInputError('There is no quest with such id: ' + parent._id);
    }
    if (!currentUser) {
      throw new InvalidAccessToken();
    }

    const isAlreadyCompleted = currentUser.completedQuestsIds?.some(id => id.toString() === parent._id.toString());

    if (isAlreadyCompleted) {
      return 'PASSED';
    } else {
      return currentUser.level < quest.minLevel ? 'LOCKED' : 'AVAILABLE';
    }
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
