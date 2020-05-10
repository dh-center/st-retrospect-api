import { ResolverContextBase } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { limitQueryWithId, applyPagination, Connection, Edge } from '../pagination';

export interface PersonDBScheme {
  _id: ObjectId;
}

/**
 * Arguments for pagination
 */
interface PaginationArguments {
  /**
   * The cursor after which we take the data
   */
  after?: string;

  /**
   * The cursor after before we take the data
   */
  before?: string;

  /**
   * The number of requested objects from the beginning of the list
   */
  first?: number;

  /**
   * The number of requested objects from the eng of the list
   */
  last?: number;
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
  },

  /**
   * Returns all locations
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param args - arguments for pagination
   * @param db - MongoDB connection to make queries
   * @return {object[]}
   */
  async persons(parent: {}, args: PaginationArguments, { db }: ResolverContextBase): Promise<Connection<PersonDBScheme>> {
    const query = db.collection<PersonDBScheme>('persons').find();
    const totalCount = await query.clone().count();

    limitQueryWithId(
      query,
      args.before,
      args.after
    );
    const pageInfo = await applyPagination(
      query, args.first, args.last
    );
    const persons = await query.toArray();
    let edges: Edge<PersonDBScheme>[] = [];
    let startCursor;
    let endCursor;

    if (persons.length) {
      edges = persons.map((person) => ({
        cursor: person._id,
        node: person
      }));
      startCursor = persons[0]._id;
      endCursor = persons[persons.length - 1]._id;
    }

    return {
      totalCount,
      edges,
      pageInfo: {
        ...pageInfo,
        startCursor: startCursor,
        endCursor: endCursor
      }
    };
  }
};

export default {
  Query
};
