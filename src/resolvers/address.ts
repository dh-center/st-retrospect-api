import { Country, Region } from '../generated/graphql';
import { MultilingualString } from '../types/graphql';

export const countries: Record<string, Country> = {
  RU: {
    code: 'RU',
    name: {
      en: 'Russian Federation',
      ru: 'Российская федерация',
    },
  },
};

export const regions: Record<string, Region> = {
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
  place: MultilingualString;

  /**
   * City district e.g. Адмиралтейский округ
   */
  locality: MultilingualString;

  /**
   * The first line of an address e.g. Пл. Никольская 1
   */
  address: MultilingualString;

  /**
   * An optional second line of an address
   */
  address2: MultilingualString;

  /**
   * Address postcode
   */
  postcode: MultilingualString;
}

const Address = {
  country(address: LocationAddress): Country {
    return countries[address.countryCode];
  },

  region(address: LocationAddress): Region {
    return regions[address.regionCode];
  },
};

export default {
  Address,
};
