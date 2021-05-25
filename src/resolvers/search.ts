import {
  QueryLocationInstanceByPersonSearchArgs,
  QueryLocationsSearchArgs,
  SearchInput
} from '../generated/graphql';
import { Collections, ResolverContextBase } from '../types/graphql';
import SearchService, { SearchResults } from '../utils/searchService';
import { LocationDBScheme, LocationInstanceDBScheme } from './locations';

const searchService = new SearchService();

/**
 * Find entities in database if no query string provided
 *
 * @param entityName - what entity to find
 * @param input - search input
 * @param context - request context
 */
async function findInDatabase<T extends keyof Collections>(entityName: T, input: SearchInput, { collection }: ResolverContextBase): Promise<SearchResults<Collections[T]>> {
  const entities = await collection(entityName)
    .find()
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
   * Full-text search of location instances by person name
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async locationInstanceByPersonSearch(
    parent: undefined,
    { input }: QueryLocationInstanceByPersonSearchArgs,
    context: ResolverContextBase
  ): Promise<SearchResults<LocationInstanceDBScheme>> {
    if (!input.query) {
      return findInDatabase('location_instances', input, context);
    }

    return searchService.searchLocationInstancesByPerson(input);
  },
};

export default {
  Query,
};
