import {
  QueryLocationInstanceByPersonSearchArgs,
  QueryLocationsSearchArgs,
  SearchInput
} from '../generated/graphql';
import { Collections, ResolverContextBase } from '../types/graphql';
import SearchService, { SearchResults } from '../utils/searchService';
import { LocationDBScheme } from './locations';
import { RelationDBScheme } from './relations';

const searchService = new SearchService();

/**
 * Find entities in database if no query string provided
 *
 * @param entityName - what entity to find
 * @param input - search input
 * @param context - request context
 */
async function findInDatabase<T extends keyof Collections>(entityName: T, input: SearchInput, { collection }: ResolverContextBase): Promise<SearchResults<Collections[T]>> {
  let cursor;

  if (input.startYear || input.endYear) {
    console.log('kek');
    cursor = collection(entityName).aggregate([
      {
        '$addFields': {
          'startYearMatch': {
            '$regexFind': {
              'input': '$startDate',
              'regex': new RegExp('\\d{4}'),
            },
          },
          'endYearMatch': {
            '$regexFind': {
              'input': '$endDate',
              'regex': new RegExp('\\d{4}'),
            },
          },
        },
      },
      {
        '$addFields': {
          yearsRange: {
            $cond: {
              if: {
                $and: [
                  { $eq: ['$startYearMatch', null] },
                  { $eq: ['$endYearMatch', null] },
                ],
              },
              then: null,
              else: {
                gte: {
                  '$toInt': '$startYearMatch.match',
                },
                lte: {
                  '$toInt': '$endYearMatch.match',
                },
              },
            },
          },
        },
      },
      {
        $match: {
          $or: [
            {
              'yearsRange.lte': {
                '$gte': input.startYear,
                '$lte': input.endYear,
              },
            },
            {
              'yearsRange.gte': {
                '$gte': input.startYear,
                '$lte': input.endYear,
              },
            },
            {
              'yearsRange.gte': {
                '$lt': input.startYear,
              },
              'yearsRange.lte': {
                '$gt': input.endYear,
              },
            },
          ],
        },
      },
    ]);
  } else {
    cursor = collection(entityName).find();
  }

  const entities = await cursor
    .skip(input.skip || 0)
    .limit(input.first || 10)
    .toArray();

  return {
    nodes: entities,
    totalCount: await collection(entityName).count(),
  };
}

const Query = {
  /**
   * Full-text search by locations
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async locationsSearch(
    parent: undefined,
    { input }: QueryLocationsSearchArgs,
    context: ResolverContextBase
  ): Promise<SearchResults<LocationDBScheme>> {
    if (!input.query) {
      return findInDatabase('locations', input, context);
    }

    return searchService.searchLocations(input);
  },


  /**
   * Full-text search of relations by person name
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async relationsByPersonSearch(
    parent: undefined,
    { input }: QueryLocationInstanceByPersonSearchArgs,
    context: ResolverContextBase
  ): Promise<SearchResults<RelationDBScheme>> {
    if (!input.query) {
      return findInDatabase('relations', input, context);
    }

    return searchService.searchRelationsByPerson(input);
  },
};

export default {
  Query,
};
