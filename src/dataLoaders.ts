import DataLoader from 'dataloader';
import { Db, ObjectId } from 'mongodb';
import { RelationDbScheme, RelationTypeDBScheme } from './resolvers/relations';
import { PersonDBScheme } from './resolvers/persons';
import { ObjectMap } from './types/utils';
import { LocationDBScheme } from './resolvers/locations';

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
    (personIds: string[]) => this.batchPersonsByIds(personIds),
    { cache: false }
  );

  /**
   * Loader for fetching relation types by their ids
   */
  public relationTypeById = new DataLoader(
    (relationTypesIds: string[]) => this.batchRelationTypesByIds(relationTypesIds)
  );

  /**
   * Loader for fetching locations by their ids
   */
  public locationById = new DataLoader(
    (locationIds: string[]) => this.batchLocationsByIds(locationIds),
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
   * Batching function for resolving persons from their ids
   * @param personIds - persons ids for resolving
   */
  private async batchPersonsByIds(personIds: string[]): Promise<PersonDBScheme[]> {
    const queryResult = await this.dbConnection.collection<PersonDBScheme>('persons')
      .find({ _id: { $in: personIds.map(id => new ObjectId(id)) } })
      .toArray();

    const personsMap: ObjectMap<PersonDBScheme> = {};

    queryResult.forEach((person) => {
      personsMap[person._id.toString()] = person;
    }, {});

    return personIds.map((personId) => personsMap[personId] || null);
  }

  /**
   * Batching function for resolving locations from their ids
   * @param locationIds - locations ids for resolving
   */
  private async batchLocationsByIds(locationIds: string[]): Promise<LocationDBScheme[]> {
    const queryResult = await this.dbConnection.collection<PersonDBScheme>('locations')
      .find({ _id: { $in: locationIds.map(id => new ObjectId(id)) } })
      .toArray();

    const locationsMap: ObjectMap<LocationDBScheme> = {};

    queryResult.forEach((location) => {
      locationsMap[location._id.toString()] = location;
    });

    return locationIds.map((locationId) => locationsMap[locationId] || null);
  }

  /**
   * Batching function for resolving relation types from their ids
   * @param relationTypesIds - relation types ids for resolving
   */
  private async batchRelationTypesByIds(relationTypesIds: string[]): Promise<RelationTypeDBScheme[]> {
    const queryResult = await this.dbConnection.collection<RelationTypeDBScheme>('relationtypes')
      .find({ _id: { $in: relationTypesIds.map(id => new ObjectId(id)) } })
      .toArray();

    const relationTypesMap: ObjectMap<RelationTypeDBScheme> = {};

    queryResult.forEach((relationType) => {
      relationTypesMap[relationType._id.toString()] = relationType;
    });

    return relationTypesIds.map((relationTypeId) => relationTypesMap[relationTypeId] || null);
  }
}
