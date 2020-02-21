import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';

export interface PersonDBScheme {
  _id: ObjectId;
}

const Query: BaseTypeResolver = {
  /**
   * Returns specific person
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - person id
   * @param db - MongoDB connection to make queries
   * @return {object}
   */
  async person(parent, { id }: { id: string }, { db }) {
    const person = await db.collection('persons').findOne({
      _id: new ObjectId(id)
    });

    if (!person) {
      return null;
    }

    return person;
  },

  /**
   * Returns all locations
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @return {object[]}
   */
  async persons(parent, data, { db }) {
    return db.collection('persons').find({}).toArray();
  }
};

export default {
  Query
};
