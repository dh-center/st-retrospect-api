import {
  CreateMutationPayload,
  DeleteMutationPayload,
  MultilingualString,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { ObjectId } from 'mongodb';
import { UserInputError } from 'apollo-server-express';
import { PersonDBScheme } from './persons';
import { RelationDbScheme } from './relations';
import mergeWith from 'lodash.mergewith';
import { QuestDBScheme } from './quests';

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
   * Array of addresses ids
   */
  addressesId?: (ObjectId | null)[];

  /**
   * Array with location instances ids
   */
  locationInstanceIds: ObjectId[]
}

export interface LocationInstanceDBScheme {
  /**
   * Location instance name
   */
  name: MultilingualString;

  /**
   * Location id which instance belongs to
   */
  locationId: ObjectId;

  /**
   * Location instance description
   */
  description: MultilingualString;

  /**
   * Wiki link with information about instance
   */

  wikiLink: string;

  /**
   * Array of location's types
   */
  locationTypesId?: (ObjectId | null)[];

  /**
   * Location instance photo links
   */
  photoLinks: string[];

  /**
   * Main photo of location instance
   */
  mainPhotoLink: string;

  /**
   * Construction date of this instance
   */
  constructionDate: string;

  /**
   * Demolition date of this instance
   */
  demolitionDate: string;

  /**
   * Beginning of the period for this instance
   */
  startDate: string;

  /**
   * Ending of the period for this instance
   */
  endDate: string;
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

const Query = {
  /**
   * Returns specific location
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - location id
   * @param db - MongoDB connection to make queries
   * @returns {object}
   */
  async location(parent: undefined, { id }: { id: string }, { db }: ResolverContextBase): Promise<LocationDBScheme | null> {
    const location = await db.collection('locations').findOne({
      _id: new ObjectId(id),
    });

    if (!location) {
      return null;
    }

    return location;
  },

  /**
   * Returns specific locationInstance
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - locationInstance id
   * @param db - MongoDB connection to make queries
   * @returns {object}
   */
  async locationInstance(parent: undefined, { id }: { id: string }, { db }: ResolverContextBase): Promise<LocationInstanceDBScheme | null> {
    const locationInstance = await db.collection('location_instances').findOne({
      _id: new ObjectId(id),
    });

    if (!locationInstance) {
      return null;
    }

    return locationInstance;
  },

  /**
   * Returns all locationInstances
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @returns {object[]}
   */
  async locationInstances(parent: undefined, data: undefined, { db }: ResolverContextBase): Promise<LocationInstanceDBScheme[]> {
    return db.collection('location_instances').find({})
      .toArray();
  },

  /**
   * Returns list of all location types
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   */
  async locationTypes(parent: undefined, data: undefined, { db }: ResolverContextBase): Promise<LocationTypeDBScheme[]> {
    return db.collection<LocationTypeDBScheme>('locationtypes').find()
      .toArray();
  },

  /**
   * Get relations on user request
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param searchString - the string on the basis of which the request will be made
   * @param db - MongoDB connection to make queries
   * @param dataLoaders - DataLoaders for fetching data
   */
  async search(parent: undefined, { searchString }: { searchString: string }, { db, dataLoaders }: ResolverContextBase): Promise<RelationDbScheme[]> {
    searchString = searchString.trim();
    if (searchString.length <= 2) {
      throw new UserInputError('Search string must contain at least 3 characters');
    }

    const searchRegExp = new RegExp(searchString, 'i');
    const persons = await db.collection<PersonDBScheme>('persons').find({
      $or: [
        { 'lastName.ru': searchRegExp },
        { 'lastName.en': searchRegExp },
      ],
    })
      .toArray();
    const personsIds = persons.map(person => person._id.toString());

    return (await dataLoaders.relationByPersonId.loadMany(personsIds)).flat() as RelationDbScheme[];
  },
};

const LocationInstance = {
  /**
   * Return all architects
   *
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
  },
};

const LocationMutations = {
  /**
   * Create new quest
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - quest object
   * @param db - MongoDB connection to make queries
   */
  async create(
    parent: undefined,
    { input }: { input: QuestDBScheme },
    { db }: ResolverContextBase
  ): Promise<CreateMutationPayload<QuestDBScheme>> {
    const quest = (await db.collection<QuestDBScheme>('quests').insertOne(input)).ops[0];

    return {
      recordId: quest._id,
      record: quest,
    };
  },

  /**
   * Update person
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - person object
   * @param db - MongoDB connection to make queries
   */
  async update(
    parent: undefined,
    { input }: { input: QuestDBScheme & {id: string} },
    { db }: ResolverContextBase
  ): Promise<UpdateMutationPayload<QuestDBScheme>> {
    input._id = new ObjectId(input.id);
    const id = input._id;

    delete input._id;

    const originalQuest = await db.collection('quests').findOne({
      _id: id,
    });

    const quest = await db.collection('quests').findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...mergeWith(originalQuest, input, (original, inp) => inp === null ? original : undefined),
          ...(input.data ? { data: input.data } : {}),
        },
      },
      { returnOriginal: false });

    return {
      recordId: id,
      record: quest.value,
    };
  },

  /**
   * Delete quest
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - object id
   * @param db - MongoDB connection to make queries
   */
  async delete(
    parent: undefined,
    { id }: { id: string },
    { db }: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
    await db.collection<QuestDBScheme>('quests').deleteOne({ _id: new ObjectId(id) });

    return {
      recordId: new ObjectId(id),
    };
  },
};

const Mutation = {
  location: (): Record<string, undefined> => ({}),
};

export default {
  Query,
  LocationInstance,
  // LocationMutations,
  Mutation,
};
