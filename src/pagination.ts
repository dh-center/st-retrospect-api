import { Cursor, FilterQuery, ObjectId } from 'mongodb';
import { PersonDBScheme } from './resolvers/persons';

/**
 * Information about this page
 */
export interface PageInfo {
  /**
   * Information about the existence of the next page
   */
  hasNextPage: boolean;

  /**
   * Information about the existence of the previous page
   */
  hasPreviousPage: boolean;

  /**
   * First cursor on this page
   */
  startCursor: ObjectId;

  /**
   * Last cursor on this page
   */
  endCursor: ObjectId;
}

interface Edge<T> {
  /**
   * Cursor of this node
   */
  cursor: ObjectId;

  /**
   * Node info
   */
  node: T;
}

export interface Connection<T> {
  /**
   * List of edges
   */
  edges: Edge<T>[];

  /**
   * Information about this page
   */
  pageInfo: PageInfo;

  /**
   * Number of available edges
   */
  totalCount: number;
}

/**
 * Returns the cursor (of the first object after the object with cursor = after, the last before cursor = before or all)
 * @param query - mongodb cursor to handle
 * @param before - the cursor after before we take the data
 * @param after - the cursor after which we take the data
 */
export function limitQueryWithId(query: Cursor, before?: string, after?: string): Cursor {
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
    filter = {};
  }

  return query.filter(filter);
}

/**
 * Modifies query according first and last arguments, returns information about the existence of the previous and next pages
 * @param query - mongodb cursor to handle
 * @param first - the number of requested objects from the beginning of the list
 * @param last - the number of requested objects from the eng of the list
 */
export async function applyPagination(query: Cursor, first?: number, last?: number): Promise<{
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}> {
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
