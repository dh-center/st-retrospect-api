import { Languages, MultilingualString } from './types/graphql';

/**
 * Get only queried languages
 * @param entity - entity to filter
 * @param languages - languages to select
 * @param multilingualFields - fields to filter
 */
export function filterEntityFields(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entity: { [key: string]: any },
  languages: Languages[],
  multilingualFields: string[]
): void {
  multilingualFields.forEach((field: string) => {
    const fieldValue = (entity[field] as MultilingualString) || {};

    entity[field] = {};
    languages.forEach((lang: string) => {
      const langLowerCase = lang.toLowerCase();

      entity[field][langLowerCase] = fieldValue[langLowerCase] || null;
    });
  });
}
