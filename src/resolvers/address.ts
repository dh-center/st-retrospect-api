import { Country, Region } from '../generated/graphql';
import { MultilingualString } from '../types/graphql';
import { WithoutId } from '../types/utils';

type CountryWithoutId = WithoutId<Country>;
type RegionWithoutId = WithoutId<Region>;

export const countries: Record<string, CountryWithoutId> = {
  RU: {
    code: 'RU',
    name: {
      en: 'Russian Federation',
      ru: 'Российская федерация',
    },
  },
};

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
  country(address: LocationAddress): CountryWithoutId {
    return countries[address.countryCode];
  },

  region(address: LocationAddress): RegionWithoutId {
    return regions[address.regionCode];
  },
};

export default {
  Address,
};
