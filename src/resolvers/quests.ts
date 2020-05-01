import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';

interface Quest {
  name: string;
  description: string;
  photo: string;
  type: string;
}

const Query: BaseTypeResolver = {
  /**
   * Returns specific quest
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - quest id
   * @param db - MongoDB connection to make queries
   * @return {object}
   */
  async quest(parent, { id }: { id: string }, { db }) {
    const quest = await db.collection('quests').findOne({
      _id: new ObjectId(id)
    });

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
  async create(parent, { input }: { input: Quest }, { db }) {
    console.log(input);
    await db.collection('quests').insertOne(input, (error, result) => {
      if (error) {
        throw error;
      } else {
        return result.ops[0];
      }
    });
  }
};

const Mutation = {
  quest: () => ({})
}

export default {
  Query,
  Mutation,
  QuestMutations
};
