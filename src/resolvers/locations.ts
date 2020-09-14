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
import { RelationDBScheme } from './relations';
import mergeWith from 'lodash.mergewith';
import { QuestDBScheme } from './quests';
import emptyMutation from '../utils/emptyMutation';
import { CreateLocationInput, UpdateLocationInput } from '../generated/graphql';
import { WithoutId } from '../types/utils';

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
   * LocationInstance id
   */
  _id: ObjectId

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
  description?: MultilingualString;

  /**
   * Wiki link with information about instance
   */

  wikiLink?: string | null;

  /**
   * Array of location's types
   */
  locationTypesId?: (ObjectId | null)[];

  /**
   * Location instance photo links
   */
  photoLinks?: string[] | null;

  /**
   * Main photo of location instance
   */
  mainPhotoLink?: string | null;

  /**
   * Construction date of this instance
   */
  constructionDate?: string | null;

  /**
   * Demolition date of this instance
   */
  demolitionDate?: string | null;

  /**
   * Beginning of the period for this instance
   */
  startDate?: string | null;

  /**
   * Ending of the period for this instance
   */
  endDate?: string | null;
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
  async search(parent: undefined, { searchString }: { searchString: string }, { db, dataLoaders }: ResolverContextBase): Promise<RelationDBScheme[]> {
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

    return (await dataLoaders.relationByPersonId.loadMany(personsIds)).flat() as RelationDBScheme[];
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
   * Create new location
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - mutation input object
   * @param collection - method for accessing to database collections
   */
  async create(
    parent: undefined,
    { input }: { input: CreateLocationInput },
    { collection }: ResolverContextBase
  ): Promise<CreateMutationPayload<LocationDBScheme>> {
    const location = (await collection('locations').insertOne({
      coordinateX: input.coordinateX,
      coordinateY: input.coordinateY,
      locationInstanceIds: [],
    })).ops[0];

    const instances = input.instances.map((inst): WithoutId<LocationInstanceDBScheme> => {
      return {
        ...inst,
        locationId: location._id,
      };
    });

    const locationInstances = (await collection('location_instances').insertMany(instances));

    await collection('locations').updateOne({ _id: location._id }, {
      $set: {
        locationInstanceIds: Object.values(locationInstances.insertedIds),
      },
    });

    location.locationInstanceIds = Object.values(locationInstances.insertedIds);

    return {
      recordId: location._id,
      record: location,
    };
  },

  /**
   * Update location
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - mutation input object
   * @param collection - method for accessing to database collections
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateLocationInput & {_id: ObjectId} },
    { collection }: ResolverContextBase
  ): Promise<UpdateMutationPayload<LocationDBScheme>> {
    input._id = new ObjectId(input.id);
    const id = input._id;

    delete input.id;

    const originalLocation = await collection('locations').findOne({
      _id: id,
    });

    if (!originalLocation) {
      throw new UserInputError('There is no location with such id: ' + id);
    }

    const location = await collection('locations').findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...mergeWith(originalLocation, input, (original, inp) => inp === null ? original : undefined),
        },
      },
      { returnOriginal: false }
    );

    if (!location.value) {
      throw new UserInputError('There is no location with such id: ' + id);
    }

    return {
      recordId: id,
      record: location.value,
    };
  },

  /**
   * Delete location
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - object id
   * @param collection - method for accessing to database collections
   */
  async delete(
    parent: undefined,
    { id }: { id: ObjectId },
    { collection }: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
    const location = (await collection('locations').findOneAndDelete({ _id: id })).value;

    if (!location) {
      throw new UserInputError('There is no location with such id: ' + id);
    }

    const locationInstancesIds = location.locationInstanceIds;

    await collection('location_instances').deleteMany({
      _id: {
        $in: locationInstancesIds,
      },
    });

    await collection('relations').deleteMany({
      locationInstanceId: {
        $in: locationInstancesIds,
      },
    });

    return {
      recordId: new ObjectId(id),
    };
  },
};

const Mutation = {
  location: emptyMutation,
};

export default {
  Query,
  LocationInstance,
  LocationMutations,
  Mutation,
};
