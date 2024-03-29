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
import emptyMutation from '../utils/emptyMutation';
import { CreateLocationInput, UpdateLocationInput } from '../generated/graphql';
import { WithoutId } from '../types/utils';
import { LocationAddress } from './address';
import sendNotify from '../utils/telegramNotify';
import mergeWithCustomizer from '../utils/mergeWithCustomizer';

/**
 * ID of relation type for architects
 */
export const ARCHITECT_RELATION_ID = '5d84ee80ff41d8a1ef3b3317';

/**
 * Location representation in DataBase
 */
export interface LocationDBScheme {
  /**
   * Id of location
   */
  _id: ObjectId;

  /**
   * Location position longitude
   */
  longitude?: number | null;

  /**
   * Location position latitude
   */
  latitude?: number | null;

  /**
   * Array of addresses ids
   */
  addresses?: LocationAddress[] | null;

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
   * Location style id
   */
  locationStyleId?: ObjectId | null;

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

  /**
   * Location instance tag ids
   */
  tagIds?: ObjectId[] | null;
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

/**
 * Location style database scheme
 */
export interface LocationStyleDBScheme {
  /**
   * Id of location style
   */
  _id: ObjectId;

  /**
   * Name of location style
   */
  name: MultilingualString;
}

const Query = {
  /**
   * Returns specific location
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
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
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
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
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async locationInstances(parent: undefined, args: undefined, { db }: ResolverContextBase): Promise<LocationInstanceDBScheme[]> {
    return db.collection('location_instances').find({})
      .toArray();
  },

  /**
   * Returns list of all location types
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async locationTypes(parent: undefined, args: undefined, { db }: ResolverContextBase): Promise<LocationTypeDBScheme[]> {
    return db.collection<LocationTypeDBScheme>('locationtypes').find()
      .toArray();
  },

  /**
   * Returns list of all location styles
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async locationStyles(parent: undefined, args: undefined, { db }: ResolverContextBase): Promise<LocationStyleDBScheme[]> {
    return db.collection<LocationStyleDBScheme>('locationstyles').find()
      .toArray();
  },
};

const LocationInstance = {
  /**
   * Return all architects
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async architects({ _id }: LocationDBScheme, args: undefined, { dataLoaders }: ResolverContextBase): Promise<PersonDBScheme[]> {
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
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async create(
    parent: undefined,
    { input }: { input: CreateLocationInput },
    { db, tokenData, collection }: ResolverContextBase<true>
  ): Promise<CreateMutationPayload<LocationDBScheme>> {
    const location = (await collection('locations').insertOne({
      latitude: input.latitude,
      longitude: input.longitude,
      locationInstanceIds: [],
      addresses: input.addresses,
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

    await sendNotify('Location', 'locations', db, tokenData, 'create', location);

    return {
      recordId: location._id,
      record: location,
    };
  },

  /**
   * Update location
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async update(
    parent: undefined,
    { input }: { input: UpdateLocationInput },
    { db, tokenData, collection }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<LocationDBScheme>> {
    const { id, ...rest } = input;
    const newInput = {
      _id: new ObjectId(id),
      ...rest,
    };

    const originalLocation = await collection('locations').findOne({
      _id: newInput._id,
    });

    if (!originalLocation) {
      throw new UserInputError('There is no location with such id: ' + newInput._id);
    }

    await sendNotify('Location', 'locations', db, tokenData, 'update', newInput, 'locations');

    const location = await collection('locations').findOneAndUpdate(
      { _id: newInput._id },
      {
        $set: {
          ...mergeWithCustomizer(originalLocation, newInput),
        },
      },
      { returnOriginal: false }
    );

    if (!location.value) {
      throw new UserInputError('There is no location with such id: ' + newInput._id);
    }

    return {
      recordId: newInput._id,
      record: location.value,
    };
  },

  /**
   * Delete location
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async delete(
    parent: undefined,
    { id }: { id: ObjectId },
    { db, tokenData, collection }: ResolverContextBase<true>
  ): Promise<DeleteMutationPayload> {
    const location = (await collection('locations').findOneAndDelete({ _id: id })).value;

    if (!location) {
      throw new UserInputError('There is no location with such id: ' + id);
    }

    await sendNotify('Location', 'locations', db, tokenData, 'delete', location);

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
      recordId: id,
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
