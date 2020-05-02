import { BaseTypeResolver } from '../types/graphql';
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

const Query: BaseTypeResolver = {
  /**
   * Returns specific quest
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - quest id
   * @param db - MongoDB connection to make queries
   * @param dataLoaders - Data loaders in context
   * @return {object}
   */
  async quest(parent, { id }: { id: string }, { db, dataLoaders }) {
    const quest = dataLoaders.questById.load(id);

    if (!quest) {
      return null;
    }

    return quest;
  },

  /**
   * Returns all quests
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @return {object[]}
   */
  async quests(parent, data, { db }) {
    return db.collection('quests').find({}).toArray();
  }
};

const QuestMutations: BaseTypeResolver = {
  /**
   * Create new quest
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - quest object
   * @param db - MongoDB connection to make queries
   * @return {object}
   */
  async create(parent, { input }: { input: QuestDBScheme }, { db }) {
    const quest = (await db.collection('quests').insertOne(input)).ops[0];
    const result = {
      questId: quest._id,
      quest
    };

    return result;
  }
};

const Mutation = {
  quest: () => ({})
};

export default {
  Query,
  Mutation,
  QuestMutations
};
