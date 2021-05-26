/* eslint-disable @typescript-eslint/naming-convention */
import { Client } from '@elastic/elasticsearch';
import getElasticClient from './getElasticClient';
import elasticIndexes from './elasticIndexes';
import { LocationDBScheme } from '../resolvers/locations';
import { RelationDBScheme } from '../resolvers/relations';


/**
 * Input for searching data
 */
interface SearchInput {
  /**
   * Query string
   */
  query: string;

  /**
   * How many items to skip in results array
   */
  skip?: number;

  /**
   * How many items to find
   */
  first?: number;
}

/**
 * Search results representation
 */
export interface SearchResults<T> {
  /**
   * Finded nodes
   */
  nodes: T[]

  /**
   * Proposed query if user made a typo
   */
  suggest?: string;

  /**
   * Number of available result items
   */
  totalCount: number;

  /**
   * Proposed query if user made a typo with indication of the place of it
   */
  highlightedSuggest?: string;
}

/**
 * Query suggestion form
 */
interface Suggestion {
  /**
   * Proposed query if user made a typo
   */
  raw: string;

  /**
   * Proposed query if user made a typo with indication of the place of it
   */
  highlighted: string;
}

/**
 * Wrapper for search methods
 */
export default class SearchService {
  /**
   * Elasticsearch client for making queries
   */
  private readonly client: Client = getElasticClient();

  /**
   * Full-text search by locations
   *
   * @param input - search params
   */
  public async searchLocations(input: SearchInput): Promise<SearchResults<LocationDBScheme>> {
    const query = {
      multi_match: {
        query: input.query,
        fuzziness: 3,
        fields: [
          'instances.name.*^10',
          'description.*^2',
          '*',
        ],
      },
    };


    const { body } = await this.client.search({
      index: elasticIndexes.locations,
      body: {
        from: input.skip,
        size: input.first,
        query,
        suggest: {
          text: input.query,
          phrase: {
            phrase: {
              field: 'suggest',
              size: 1,
              gram_size: 3,
              direct_generator: [
                {
                  field: 'suggest',
                  suggest_mode: 'always',
                },
              ],
              highlight: {
                pre_tag: '<b>',
                post_tag: '</b>',
              },
            },
          },
        },
      },
    });

    const suggest = this.parseSuggestions(body.suggest);

    return {
      suggest: suggest?.raw,
      highlightedSuggest: suggest?.highlighted,
      nodes:  body.hits.hits.map((hit: any) => ({
        _id: hit._id,
        ...hit._source,
      })),
      totalCount:  body.hits.total.value,
    };
  }

  /**
   * Full-text search of location instances by person name
   *
   * @param input - search params
   */
  public async searchRelationsByPerson(input: SearchInput): Promise<SearchResults<RelationDBScheme>> {
    const query = {
      multi_match: {
        query: input.query,
        fields: [
          'person.name.*',
        ],
      },
    };

    const { body } = await this.client.search({
      index: elasticIndexes.relations,
      body: {
        from: input.skip,
        size: input.first,
        query,
      },
    });

    const suggestion = this.parseSuggestions(body.suggest);

    return {
      nodes: body.hits.hits.map((hit: any) => ({
        _id: hit._id,
        ...hit._source,
      })),
      totalCount: body.hits.total.value,
      suggest: suggestion?.raw,
      highlightedSuggest: suggestion?.highlighted,
    };
  }

  /**
   * Parse suggestions from server response and return it in convenient format
   *
   * @param suggest - suggest to parse
   */
  private parseSuggestions(suggest: any): Suggestion | null {
    if (!suggest) {
      return null;
    }

    const suggestOptions = suggest?.phrase?.shift()?.options;

    if (!suggestOptions || suggestOptions.length <= 0) {
      return null;
    }
    const [ option ] = suggestOptions;

    return {
      raw: option.text,
      highlighted: option.highlighted,
    };
  }
}

