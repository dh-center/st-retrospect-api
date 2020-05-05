import { BaseTypeResolver } from '../types/graphql';
import { Cursor, FilterQuery, ObjectId } from 'mongodb';

export interface PersonDBScheme {
  _id: ObjectId;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: Cursor;
  endCursor: Cursor;
}

/**
 * limitQueryWithId
 * @param query
 * @param before
 * @param after
 */
function limitQueryWithId(query: Cursor, before: string, after: string): Cursor {
  let filter: FilterQuery<PersonDBScheme>;

  if (before) {
    filter = {
      _id: {
        $lt: new ObjectId(before)
      }
    };
  } else if (after) {
    filter = {
      _id: {
        $gt: new ObjectId(after)
      }
    };
  } else {
    filter = {
      _id: {}
    };
  }

  return query.filter(filter);
}

/**
 * applyPagination
 * @param query
 * @param first
 * @param last
 */
async function applyPagination(query: Cursor, first: number, last: number): Promise<object> {
  const count = await query.clone().count();

  if (first || last) {
    let limit;
    let skip;

    if (first && count > first) {
      limit = first;
    }

    if (last) {
      if (limit && limit > last) {
        skip = limit - last;
        limit = limit - skip;
      } else if (!limit && count > last) {
        skip = count - last;
      }
    }

    if (skip) {
      query.skip(skip);
    }

    if (limit) {
      query.limit(limit);
    }
  }

  return {
    hasNextPage: Boolean(first && count > first),
    hasPreviousPage: Boolean(last && count > last)
  };
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
  async persons(parent, { after, before, first, last }: {after: string; before: string; first: number; last: number}, { db }) {
    const query = limitQueryWithId(
      db.collection<PersonDBScheme>('persons').find(),
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
