import {
  CreateMutationPayload,
  DeleteMutationPayload,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { ObjectId } from 'mongodb';
import { EditorData } from '../types/editorData';
import mergeWith from 'lodash.mergewith';
import emptyMutation from '../utils/emptyMutation';
import sendNotify from '../utils/telegramNotify';

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
  type: string;

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
   * @param id.id
   * @param id - quest id
   * @param db - MongoDB connection to make queries
   * @param db.dataLoaders
   * @param dataLoaders - Data loaders in context
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
   * @param input.input
   * @param input - mutation input object
   * @param db.db
   * @param db - MongoDB connection to make queries
   * @param db.user
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
   * @param input.input
   * @param input - mutation input object
   * @param db.db
   * @param db - MongoDB connection to make queries
   * @param db.user
   */
  async update(
    parent: undefined,
    { input }: { input: QuestDBScheme & {id: string} },
    { db, user }: ResolverContextBase
  ): Promise<UpdateMutationPayload<QuestDBScheme>> {
    input._id = new ObjectId(input.id);
    const id = input._id;

    delete input._id;

    const originalQuest = await db.collection('quests').findOne({
      _id: id,
    });

    await sendNotify('Quest', 'quests', db, user, 'update', input, 'quests');

    const quest = await db.collection('quests').findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...mergeWith(originalQuest, input, (original, inp) => inp === null ? original : undefined),
          ...(input.data ? { data: input.data } : {}),
        },
      },
      { returnOriginal: false });

    return {
      recordId: id,
      record: quest.value,
    };
  },

  /**
   * Delete quest
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id.id
   * @param id - object id
   * @param db.db
   * @param db - MongoDB connection to make queries
   * @param db.user
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

const Mutation = {
  quest: emptyMutation,
};

export default {
  Query,
  Mutation,
  QuestMutations,
};
