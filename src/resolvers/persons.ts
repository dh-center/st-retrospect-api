import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { PageInfo, limitQueryWithId, applyPagination } from '../pagination';

export interface PersonDBScheme {
  _id: ObjectId;
}

interface PaginationArg {
  /**
   * The cursor after which we take the data
   */
  after: string;

  /**
   * The cursor after before we take the data
   */
  before: string;

  /**
   * The number of requested objects from the beginning of the list
   */
  first: number;

  /**
   * The number of requested objects from the eng of the list
   */
  last: number;
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
   * @param db - MongoDB connection to make queries
   * @return {object[]}
   */
  async persons(parent, { after, before, first, last }: PaginationArg, { db }) {
    const query = db.collection<PersonDBScheme>('persons').find();

    limitQueryWithId(
      query,
      before,
      after
    );
    const pageInfo = await applyPagination(
      query, first, last
    );
    const persons = await query.toArray();
    const edges = persons.map(
      (person) => (
        {
          cursor: person._id,
          node: person
        }));

    return {
      edges,
      pageInfo: {
        ...pageInfo,
        startCursor: persons[0]._id,
        endCursor: persons[persons.length - 1]._id
      }
    };
  }
};

export default {
  Query
};
