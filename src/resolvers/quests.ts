import { CreateMutationPayload, ResolverContextBase, UpdateMutationPayload } from '../types/graphql';
import { ObjectId } from 'mongodb';
import merge from 'lodash.merge';
import { EditorData } from '../types/editorData';

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
   * @param id - quest id
   * @param db - MongoDB connection to make queries
   * @param dataLoaders - Data loaders in context
   * @returns {object}
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
   * @param input - quest object
   * @param db - MongoDB connection to make queries
   * @returns {object}
   */
  async create(
    parent: undefined,
    { input }: { input: QuestDBScheme },
    { db }: ResolverContextBase
  ): Promise<CreateMutationPayload<QuestDBScheme>> {
    const quest = (await db.collection<QuestDBScheme>('quests').insertOne(input)).ops[0];

    return {
      recordId: quest._id,
      record: quest,
    };
  },

  /**
   * Update person
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - person object
   * @param db - MongoDB connection to make queries
   * @returns {object}
   */
  async update(
    parent: undefined,
    { input }: { input: QuestDBScheme & {id: string} },
    { db }: ResolverContextBase
  ): Promise<UpdateMutationPayload<QuestDBScheme>> {
    input._id = new ObjectId(input.id);
    const id = input._id;

    delete input._id;

    const originalQuest = await db.collection('quests').findOne({
      _id: id,
    });

    const quest = await db.collection('quests').findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...merge(originalQuest, input),
          data: input.data,
        },
      },
      { returnOriginal: false });

    return {
      recordId: id,
      record: quest.value,
    };
  },
};

const Mutation = {
  quest: (): Record<string, undefined> => ({}),
};

export default {
  Query,
  Mutation,
  QuestMutations,
};
