/* eslint-disable @typescript-eslint/naming-convention */
import { Client } from '@elastic/elasticsearch';
import getElasticClient from './getElasticClient';
import elasticIndexes from './elasticIndexes';
import { LocationDBScheme, LocationInstanceDBScheme } from '../resolvers/locations';


interface SearchInput {
  query: string;
  skip?: number;
  first?: number;
}

interface SearchResults<T> {
  nodes: T
  suggest?: string;
  totalCount: number;
  highlightedSuggest?: string;
}

interface Suggestion {
  raw: string;
  highlighted: string;
}

/**
 *
 */
export default class SearchService {
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
  public async searchLocationInstancesByPerson(input: SearchInput): Promise<SearchResults<LocationInstanceDBScheme>> {
    const query = {
      multi_match: {
        query: input.query,
        fuzziness: 3,
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
      nodes: body.hits.hits.map((hit: any) => (hit._source.locationInstance)),
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

