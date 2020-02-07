import { BaseTypeResolver, MultilingualString, ResolverContextBase } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { UserInputError } from 'apollo-server-express';
import { filterEntityFields } from '../utils';
import { PersonDBScheme } from './persons';
import { multilingualRelationFields, RelationDbScheme } from './relations';

/**
 * Multilingual location fields
 */
export const multilingualLocationFields = [
  'name',
  'description'
];

/**
 * @deprecated
 */
export interface Location {
  /**
   * Id of location
   */
  _id: ObjectId;

  /**
   * Latitude of the location
   */
  coordinateX: number;

  /**
   * Longitude of the location
   */
  coordinateY: number;

  /**
   * Array of location's types
   */
  locationTypesId: ObjectId[];
}

/**
 * Location representation in DataBase
 */
export interface LocationDBScheme {
  /**
   * Id of location
   */
  _id: ObjectId;

  /**
   * Array of location's types
   */
  locationTypesId?: (ObjectId | null)[];

  /**
   * Array of addresses ids
   */
  addressesId?: (ObjectId | null)[];
}

/**
 * Address representation in DataBase
 */
export interface AddressesDBScheme {
  /**
   * Id of address
   */
  _id: ObjectId;

  /**
   * Street on which the location is located
   */
  street: MultilingualString;

  /**
   * Build name
   */
  build: MultilingualString;

  /**
   * House number on the street
   */
  homeNumber: string;

  /**
   * Corps of home
   */
  housing: string;

  /**
   * Link for location info
   */
  link: string;
}

/**
 * LocationType representation in DataBase
 */
export interface LocationTypeDBScheme {
  /**
   * Id of locationType
   */
  _id: ObjectId;

  /**
   * Name of locationType
   */
  name: MultilingualString;
}

const Query: BaseTypeResolver = {
  /**
   * Returns specific location
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - location id
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @return {object}
   */
  async location(parent, { id }: { id: string }, { db, languages }) {
    const location = await db.collection('locations').findOne({
      _id: new ObjectId(id)
    });

    if (!location) {
      return null;
    }

    filterEntityFields(location, languages, multilingualLocationFields);
    return location;
  },

  /**
   * Returns all locations
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @return {object[]}
   */
  async locations(parent, data, { db, languages }) {
    const locations = await db.collection('locations').find({}).toArray();

    locations.map((location) => {
      filterEntityFields(location, languages, multilingualLocationFields);
      return location;
    });
    return locations;
  },

  /**
   * Get relations on user request
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param searchString - the string on the basis of which the request will be made
   * @param db - MongoDB connection to make queries
   * @param dataLoaders - DataLoaders for fetching data
   */
  async search(parent, { searchString }: { searchString: string }, { db, dataLoaders }) {
    searchString = searchString.trim();
    if (searchString.length <= 2) {
      throw new UserInputError('Search string must contain at least 3 characters');
    }

    const searchRegExp = new RegExp(searchString, 'i');
    const persons = await db.collection<PersonDBScheme>('persons').find({
      $or: [
        { 'lastName.ru': searchRegExp },
        { 'lastName.en': searchRegExp }
      ]
    }).toArray();
    const personsIds = persons.map(person => person._id.toString());

    return (await dataLoaders.relationByPersonId.loadMany(personsIds)).flat();
  }
};

const Location = {
  /**
   * Returns type of location
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param _args - empty list of args
   * @param dataLoaders - DataLoaders for fetching data
   */
  async locationTypes(parent: LocationDBScheme, _args: undefined, { dataLoaders }: ResolverContextBase): Promise<LocationTypeDBScheme[]> {
    if (!parent.locationTypesId) {
      return [];
    }

    const locationTypes = await dataLoaders.locationTypeById.loadMany(
      (parent.locationTypesId.filter(id => id) as ObjectId[])
        .map(id => id.toString())
    );

    return locationTypes.filter(type => type) as LocationTypeDBScheme[];
  },

  /**
   * Returns addresses of location
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param _args - empty list of args
   * @param dataLoaders - DataLoaders for fetching data
   */
  async addresses(parent: LocationDBScheme, _args: undefined, { dataLoaders }: ResolverContextBase): Promise<AddressesDBScheme[]> {
    if (!parent.addressesId) {
      return [];
    }

    const addresses = await dataLoaders.addressesById.loadMany(
      (parent.addressesId.filter(id => id) as ObjectId[])
        .map(id => id.toString())
    );

    return addresses.filter(type => type) as AddressesDBScheme[];
  },

  /**
   * Return all location relations
   * @param _id - location id that returned from the resolver on the parent field
   * @param _args - empty list of args
   * @param languages - languages in which return data
   * @param dataLoaders - DataLoaders for fetching data
   * @return {object[]}
   */
  async relations({ _id }: LocationDBScheme, _args: undefined, { languages, dataLoaders }: ResolverContextBase): Promise<RelationDbScheme[]> {
    const relations = await dataLoaders.relationByLocationId.load(_id.toString());

    relations.map((relation) => {
      filterEntityFields(relation, languages, multilingualRelationFields);
      return relation;
    });

    return relations;
  }
};

export default {
  Query,
  Location
};
