import DataLoader from 'dataloader';
import { Db, ObjectId } from 'mongodb';
import { RelationDbScheme, RelationTypeDBScheme } from './resolvers/relations';
import { PersonDBScheme } from './resolvers/persons';
import { ObjectMap } from './types/utils';
import { LocationDBScheme } from './resolvers/locations';
import {RouteDBScheme} from './resolvers/routes';

/**
 * Class for setting up data loaders
 */
export default class DataLoaders {
  /**
   * MongoDB connection to make queries
   */
  private dbConnection: Db;

  /**
   * Creates DataLoaders instance
   * @param dbConnection - MongoDB connection to make queries
   */
  constructor(dbConnection: Db) {
    this.dbConnection = dbConnection;
  }

  /**
   * Loader for fetching relations by persons ids
   */
  public relationByPersonId = new DataLoader(
    (personIds: string[]) => this.batchRelationsByPersonIds(personIds),
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
   * Loader for fetching persons by their ids
   */
  public routesById = new DataLoader(
    (routeIds: string[]) => this.batchByIds<RouteDBScheme>('routes', routeIds),
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
   * Loader for fetching locations by their ids
   */
  public locationById = new DataLoader(
    (locationIds: string[]) => this.batchByIds<LocationDBScheme>('locations', locationIds),
    { cache: false }
  );

  /**
   * Batching function for resolving relations from persons ids
   * @param personIds - persons ids for resolving
   */
  private async batchRelationsByPersonIds(personIds: string[]): Promise<RelationDbScheme[][]> {
    const queryResult = await this.dbConnection.collection<RelationDbScheme>('relations')
      .find({ personId: { $in: personIds.map(id => new ObjectId(id)) } })
      .toArray();

    const relationsMap: ObjectMap<RelationDbScheme[]> = {};

    queryResult.forEach((relation) => {
      if (!relationsMap[relation.personId.toString()]) {
        relationsMap[relation.personId.toString()] = [];
      }
      relationsMap[relation.personId.toString()].push(relation);
    });

    return personIds.map((personId) => relationsMap[personId] || []);
  }

  /**
   * Batching function for resolving entities from their ids
   * @param collectionName
   * @param ids - ids for resolving
   */
  private async batchByIds<T extends {_id: ObjectId}>(collectionName: string, ids: string[]): Promise<(T| null)[]> {
    const queryResult = await this.dbConnection.collection(collectionName)
      .find({
        _id: { $in: ids.map(id => new ObjectId(id)) }
      })
      .toArray();

    const personsMap: ObjectMap<T> = {};

    queryResult.forEach((entity: T) => {
      personsMap[entity._id.toString()] = entity;
    }, {});

    return ids.map((entityId) => personsMap[entityId] as T || null);
  }
}
