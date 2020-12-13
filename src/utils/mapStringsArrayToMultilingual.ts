import { Languages, MultilingualString } from '../types/graphql';

/**
 * Maps array of strings to array of multilingual strings
 *
 * @param input - array of string
 * @param lang - language to map for
 */
export default function mapArrayInputToMultilingual(input: string[], lang: Languages[]): MultilingualString[] {
  return input.map(syn => ({ [lang[0].toLowerCase()]: syn }));
}
