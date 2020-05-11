import { ResolverContextBase } from '../types/graphql';
import { ObjectId } from 'mongodb';

export interface PersonDBScheme {
  _id: ObjectId;
}

const Query = {
  /**
   * Returns specific person
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - person id
   * @param db - MongoDB connection to make queries
   * @return {object}
   */
  async person(parent: {}, { id }: { id: string }, { db }: ResolverContextBase): Promise<PersonDBScheme | null> {
    const person = await db.collection('persons').findOne({
      _id: new ObjectId(id)
    });

    if (!person) {
      return null;
    }

    return person;
  }
};

export default {
  Query
};
