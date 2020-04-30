import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';

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

export default {
  Query
};
