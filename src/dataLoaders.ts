import DataLoader from 'dataloader';
import { Db, ObjectId } from 'mongodb';
import { RelationDbScheme, RelationTypeDBScheme } from './resolvers/relations';
import { PersonDBScheme } from './resolvers/persons';
import { ObjectMap } from './types/utils';
import { AddressesDBScheme, LocationDBScheme, LocationTypeDBScheme } from './resolvers/locations';
import { RouteDBScheme } from './resolvers/routes';
import { QuestDBScheme } from './resolvers/quests';

/**
 * Class for setting up data loaders
 */
export default class DataLoaders {
  /**
   * Loader for fetching relations by persons ids
   */
  public relationByPersonId = new DataLoader(
    (personIds: string[]) => this.batchRelationsByPersonIds(personIds),
    { cache: false }
  );

  /**
   * Loader for fetching relations by locations ids
   */
  public relationByLocationInstanceId = new DataLoader(
    (locationInstanceIds: string[]) => this.batchRelationsByLocationInstanceIds(locationInstanceIds),
    { cache: false }
  );

  /**
   * Loader for fetching persons by their ids
   */
  public personById = new DataLoader(
    (personIds: string[]) => this.batchByIds<PersonDBScheme>('persons', personIds),
    { cache: false }
  );

  /**
   * Loader for fetching routes by their ids
   */
  public routesById = new DataLoader(
    (routeIds: string[]) => this.batchByIds<RouteDBScheme>('routes', routeIds),
    { cache: false }
  );

  /**
   * Loader for fetching addresses by their ids
   */
  public addressesById = new DataLoader(
    (addressIds: string[]) => this.batchByIds<AddressesDBScheme>('addresses', addressIds),
    { cache: false }
  );

  /**
   * Loader for fetching relation types by their ids
   */
  public relationTypeById = new DataLoader(
    (relationTypesIds: string[]) => this.batchByIds<RelationTypeDBScheme>('relationtypes', relationTypesIds),
    { cache: false }
  );

  /**
   * Loader for fetching locations types by their ids
   */
  public locationTypeById = new DataLoader(
    (locationTypesIds: string[]) => this.batchByIds<LocationTypeDBScheme>('locationtypes', locationTypesIds),
    { cache: false }
  );

  /**
   * Loader for fetching locationInstance by their ids
   */
  public locationInstanceById = new DataLoader(
    (locationInstanceIds: string[]) => this.batchByIds<LocationDBScheme>('location_instances', locationInstanceIds),
    { cache: false }
  );

  /**
   * Loader for fetching location by their ids
   */
  public locationById = new DataLoader(
    (locationIds: string[]) => this.batchByIds<LocationDBScheme>('locations', locationIds),
    { cache: false }
  );

  /**
   * Loader for fetching quests by their ids
   */
  public questById = new DataLoader(
    (questIds: string[]) => this.batchByIds<QuestDBScheme>('quests', questIds),
    { cache: false }
  );

  /**
   * MongoDB connection to make queries
   */
  private dbConnection: Db;

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
  private async batchRelationsByPersonIds(personIds: string[]): Promise<RelationDbScheme[][]> {
    const queryResult = await this.dbConnection.collection<RelationDbScheme>('relations')
      .find({ personId: { $in: personIds.map(id => new ObjectId(id)) } })
      .toArray();

    const relationsMap: ObjectMap<RelationDbScheme[]> = {};

    queryResult.forEach((relation) => {
      if (!relation.personId) {
        return;
      }
      if (!relationsMap[relation.personId.toString()]) {
        relationsMap[relation.personId.toString()] = [];
      }
      relationsMap[relation.personId.toString()].push(relation);
    });

    return personIds.map((personId) => relationsMap[personId] || []);
  }

  /**
   * Batching function for resolving relations from location ids
   *
   * @param locationInstanceIds - location instances ids for resolving
   */
  private async batchRelationsByLocationInstanceIds(locationInstanceIds: string[]): Promise<RelationDbScheme[][]> {
    const queryResult = await this.dbConnection.collection<RelationDbScheme>('relations')
      .find({ locationInstanceId: { $in: locationInstanceIds.map(id => new ObjectId(id)) } })
      .toArray();

    const relationsMap: ObjectMap<RelationDbScheme[]> = {};

    queryResult.forEach((relation) => {
      if (!relation.locationInstanceId) {
        return;
      }
      if (!relationsMap[relation.locationInstanceId.toString()]) {
        relationsMap[relation.locationInstanceId.toString()] = [];
      }
      relationsMap[relation.locationInstanceId.toString()].push(relation);
    });

    return locationInstanceIds.map((locationInstanceId) => relationsMap[locationInstanceId] || []);
  }

  /**
   * Batching function for resolving entities from their ids
   *
   * @param collectionName - collection name to fetch data
   * @param ids - ids for resolving
   */
  private async batchByIds<T extends {_id: ObjectId}>(collectionName: string, ids: string[]): Promise<(T| null)[]> {
    const queryResult = await this.dbConnection.collection(collectionName)
      .find({
        _id: { $in: ids.map(id => new ObjectId(id)) },
      })
      .toArray();

    const personsMap: ObjectMap<T> = {};

    queryResult.forEach((entity: T) => {
      personsMap[entity._id.toString()] = entity;
    }, {});

    return ids.map((entityId) => personsMap[entityId] as T || null);
  }
}

/**
 * All field names contained dataLoader instances
 */
export type FieldsWithDataLoader = {
  [Key in keyof DataLoaders]: DataLoader<unknown, unknown> extends DataLoaders[Key] ? Key : never;
}[keyof DataLoaders]
