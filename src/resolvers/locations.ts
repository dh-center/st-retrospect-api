import { BaseTypeResolver, MultilingualString, ResolverContextBase } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { UserInputError } from 'apollo-server-express';
import { PersonDBScheme } from './persons';

/**
 * ID of relation type for architects
 */
const ARCHITECT_RELATION_ID = '5d84ee80ff41d8a1ef3b3317';

/**
 * Location representation in DataBase
 */
export interface LocationDBScheme {
  /**
   * Id of location
   */
  _id: ObjectId;

  /**
   * Location coordinate by Y
   */
  coordinateY: number;

  /**
   * Location coordinate by X
   */
  coordinateX: number;

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
   * @return {object}
   */
  async location(parent, { id }: { id: string }, { db }) {
    const location = await db.collection('locations').findOne({
      _id: new ObjectId(id)
    });

    if (!location) {
      return null;
    }

    return location;
  },

  /**
   * Returns all locations
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @return {object[]}
   */
  async locations(parent, data, { db }) {
    return db.collection('locations').find({}).toArray();
  },

  async locationInstances(parent, data, { db }) {
    return db.collection('location_instances').find({}).toArray();
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

const Instance = {
  /**
   * Return all architects
   * @param _id - location id that returned from the resolver on the parent field
   * @param _args - empty list of args
   * @param dataLoaders - DataLoaders for fetching data
   */
  async architects({ _id }: LocationDBScheme, _args: undefined, { dataLoaders }: ResolverContextBase): Promise<PersonDBScheme[]> {
    const relations = await dataLoaders.relationByLocationInstanceId.load(_id.toString());
    const personIds: string[] = [];

    relations.forEach((relation) => {
      if (!relation.relationId || !relation.personId) {
        return;
      }
      if (relation.relationId.toString() === ARCHITECT_RELATION_ID) {
        personIds.push(relation.personId.toString());
      }
    });

    return (await dataLoaders.personById.loadMany(personIds)).filter(Boolean) as PersonDBScheme[];
  }
};

export default {
  Query,
  Instance
};
