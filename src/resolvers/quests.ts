import { CreateMutationPayload, ResolverContextBase } from '../types/graphql';
import { ObjectId } from 'mongodb';

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
};

const Mutation = {
  quest: (): Record<string, undefined> => ({}),
};

export default {
  Query,
  Mutation,
  QuestMutations,
};
