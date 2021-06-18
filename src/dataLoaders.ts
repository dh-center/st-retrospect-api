import DataLoader from 'dataloader';
import type { Db } from 'mongodb';
import { ObjectId } from 'mongodb';
import type { RelationDBScheme } from './resolvers/relations';
import type { PersonDBScheme } from './resolvers/persons';
import type { ObjectMap } from './types/utils';
import type {
  LocationDBScheme,
  LocationInstanceDBScheme,
  LocationStyleDBScheme,
  LocationTypeDBScheme
} from './resolvers/locations';
import type { QuestDBScheme } from './resolvers/quests';
import { countries, regions } from './resolvers/address';
import type { RelationTypeDBScheme } from './resolvers/relationTypes';
import { UserDBScheme } from './resolvers/users';
import { TagDBScheme } from './resolvers/tags';
import { achievementsArray } from './resolvers/achievements';

/**
 * Class for setting up data loaders
 */
export default class DataLoaders {
  /**
   * Loader for fetching relations by persons ids
   */
  public relationByPersonId = new DataLoader(
    async (personIds: readonly string[]) => this.batchRelationsByPersonIds(personIds),
    { cache: false }
  );

  /**
   * Loader for fetching relations by persons ids
   */
  public userById = new DataLoader(
    async (userIds: readonly string[]) => this.batchByIds<UserDBScheme>('users', userIds),
    { cache: false }
  );

  /**
   * Loader for fetching relations by their ids
   */
  public relationById = new DataLoader(
    async (relationIds: readonly string[]) => this.batchByIds<RelationDBScheme>('relations', relationIds),
    { cache: false }
  );

  /**
   * Loader for fetching achievements by their ids
   */
  public achievementById = new DataLoader(
    async (achievementIds: readonly string[]) => {
      return achievementIds.map(id => {
        return achievementsArray.find(ach => ach._id.toString() === id);
      });
    },
    { cache: false }
  );

  /**
   * Loader for fetching relations by locations ids
   */
  public relationByLocationInstanceId = new DataLoader(
    async (locationInstanceIds: readonly string[]) => this.batchRelationsByLocationInstanceIds(locationInstanceIds),
    { cache: false }
  );

  /**
   * Loader for fetching persons by their ids
   */
  public personById = new DataLoader(
    async (personIds: readonly string[]) => this.batchByIds<PersonDBScheme>('persons', personIds),
    { cache: false }
  );

  /**
   * Loader for fetching relation types by their ids
   */
  public relationTypeById = new DataLoader(
    async (relationTypesIds: readonly string[]) => this.batchByIds<RelationTypeDBScheme>('relationtypes', relationTypesIds),
    { cache: false }
  );

  /**
   * Loader for fetching locations types by their ids
   */
  public locationTypeById = new DataLoader(
    async (locationTypesIds: readonly string[]) => this.batchByIds<LocationTypeDBScheme>('locationtypes', locationTypesIds),
    { cache: false }
  );

  /**
   * Loader for fetching locations styles by their ids
   */
  public locationStyleById = new DataLoader(
    async (locationStyleIds: readonly string[]) => this.batchByIds<LocationStyleDBScheme>('locationstyles', locationStyleIds),
    { cache: false }
  );

  public countryById = new DataLoader(
    async (codes: readonly string[]) => codes.map((code) => countries[code])
  );

  public regionById = new DataLoader(
    async (codes: readonly string[]) => codes.map((code) => regions[code])
  );

  /**
   * Loader for fetching locationInstance by their ids
   */
  public locationInstanceById = new DataLoader(
    async (locationInstanceIds: readonly string[]) => this.batchByIds<LocationInstanceDBScheme>('location_instances', locationInstanceIds),
    { cache: false }
  );

  /**
   * Loader for fetching location by their ids
   */
  public locationById = new DataLoader(
    async (locationIds: readonly string[]) => this.batchByIds<LocationDBScheme>('locations', locationIds),
    { cache: false }
  );

  /**
   * Loader for fetching quests by their ids
   */
  public questById = new DataLoader(
    async (questIds: readonly string[]) => this.batchByIds<QuestDBScheme>('quests', questIds),
    { cache: false }
  );

  /**
   * Loader for fetching tags by their ids
   */
  public tagById = new DataLoader(
    async (tagIds: readonly string[]) => this.batchByIds<TagDBScheme>('tags', tagIds),
    { cache: false }
  );

  /**
   * MongoDB connection to make queries
   */
  private readonly dbConnection: Db;

  /**
   * Creates DataLoaders instance
   *
   * @param dbConnection - MongoDB connection to make queries
   */
  constructor(dbConnection: Db) {
    this.dbConnection = dbConnection;
  }

  /**
   * Batching function for resolving relations from persons ids
   *
   * @param personIds - persons ids for resolving
   */
  private async batchRelationsByPersonIds(personIds: readonly string[]): Promise<RelationDBScheme[][]> {
    const queryResult = await this.dbConnection.collection<RelationDBScheme>('relations')
      .find({ personId: { $in: personIds.map(id => new ObjectId(id)) } })
      .toArray();

    const relationsMap: ObjectMap<RelationDBScheme[] | undefined> = {};

    queryResult.forEach((relation) => {
      if (!relation.personId) {
        return;
      }

      const relationInMap = relationsMap[relation.personId.toString()];

      if (!relationInMap) {
        relationsMap[relation.personId.toString()] = [ relation ];
      } else {
        relationInMap.push(relation);
      }
    });

    return personIds.map((personId) => relationsMap[personId] ?? []);
  }

  /**
   * Batching function for resolving relations from location ids
   *
   * @param locationInstanceIds - location instances ids for resolving
   */
  private async batchRelationsByLocationInstanceIds(locationInstanceIds: readonly string[]): Promise<RelationDBScheme[][]> {
    const queryResult = await this.dbConnection.collection<RelationDBScheme>('relations')
      .find({ locationInstanceId: { $in: locationInstanceIds.map(id => new ObjectId(id)) } })
      .toArray();

    const relationsMap: ObjectMap<RelationDBScheme[] | undefined> = {};

    queryResult.forEach((relation) => {
      if (!relation.locationInstanceId) {
        return;
      }

      const relationInMap = relationsMap[relation.locationInstanceId.toString()];

      if (!relationInMap) {
        relationsMap[relation.locationInstanceId.toString()] = [ relation ];
      } else {
        relationInMap.push(relation);
      }
    });

    return locationInstanceIds.map((locationInstanceId) => relationsMap[locationInstanceId] ?? []);
  }

  /**
   * Batching function for resolving entities from their ids
   *
   * @param collectionName - collection name to fetch data
   * @param ids - ids for resolving
   */
  private async batchByIds<T extends {_id: ObjectId}>(collectionName: string, ids: readonly string[]): Promise<(T| null)[]> {
    const queryResult = await this.dbConnection.collection(collectionName)
      .find({
        _id: { $in: ids.map(id => new ObjectId(id)) },
      })
      .toArray();

    const personsMap: ObjectMap<T | undefined> = {};

    queryResult.forEach((entity: T) => {
      personsMap[entity._id.toString()] = entity;
    }, {});

    return ids.map((entityId) => personsMap[entityId] ?? null);
  }
}

/**
 * All field names contained dataLoader instances
 */
export type FieldsWithDataLoader = {
  [Key in keyof DataLoaders]: DataLoader<never, never> extends DataLoaders[Key] ? Key : never;
}[keyof DataLoaders];
