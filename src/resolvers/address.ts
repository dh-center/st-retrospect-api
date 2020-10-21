import { Country, Region } from '../generated/graphql';
import { MultilingualString } from '../types/graphql';
import { WithoutId } from '../types/utils';

type CountryWithoutId = WithoutId<Country>;
type RegionWithoutId = WithoutId<Region>;

/**
 * Available countries
 */
export const countries: Record<string, CountryWithoutId> = {
  RU: {
    code: 'RU',
    name: {
      en: 'Russian Federation',
      ru: 'Российская федерация',
    },
  },
};

/**
 * Available regions
 */
export const regions: Record<string, RegionWithoutId> = {
  'RU-LEN': {
    code: 'RU-LEN',
    name: {
      en: 'Leningradskaya oblast\'',
      ru: 'Ленинградская область',
    },
  },
  'RU-SPE': {
    code: 'RU-SPE',
    name: {
      en: 'St. Petersburg',
      ru: 'Санкт-Петербург',
    },
  },
};

/**
 * Location address representation
 */
export interface LocationAddress {
  /**
   * Country data
   */
  countryCode: string;

  /**
   * Country region data
   */
  regionCode: string;

  /**
   * City name, e.g. Saint-Petersburg
   */
  place?: MultilingualString | null;

  /**
   * City district e.g. Адмиралтейский округ
   */
  locality?: MultilingualString | null;

  /**
   * The first line of an address e.g. Пл. Никольская 1
   */
  address: MultilingualString;

  /**
   * An optional second line of an address
   */
  address2?: MultilingualString | null;

  /**
   * Address postcode
   */
  postcode?: MultilingualString | null;
}

const Address = {
  /**
   * Get country data by its code
   *
   * @param address - resolved address from parent resolver
   */
  country(address: LocationAddress): CountryWithoutId {
    return countries[address.countryCode];
  },

  /**
   * Get region data by its code
   *
   * @param address - resolved address from parent resolver
   */
  region(address: LocationAddress): RegionWithoutId {
    return regions[address.regionCode];
  },
};

export default {
  Address,
};
