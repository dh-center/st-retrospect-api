import DataLoader from 'dataloader';
import { Db, ObjectId } from 'mongodb';
import { MixedRelation } from './resolvers/relations';
import { PersonDBScheme } from './resolvers/persons';
import { ObjectMap } from './types/utils';

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
   * @param dbConnection
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
  public personsByIds = new DataLoader(
    (personIds: string[]) => this.batchPersonsByIds(personIds),
    { cache: false }
  );

  /**
   * Batching function for resolving relations from persons ids
   * @param personIds - persons ids for resolving
   */
  private async batchRelationsByPersonIds(personIds: string[]): Promise<MixedRelation[][]> {
    const queryResult = await this.dbConnection.collection<MixedRelation>('relations')
      .aggregate([
        {
          $match: { personId: { $in: personIds.map(id => new ObjectId(id)) } }
        },
        {
          $lookup: {
            from: 'locations',
            localField: 'locationId',
            foreignField: '_id',
            as: 'location'
          }
        },
        {
          $unwind: '$location'
        }
      ])
      .toArray();

    const relationsMap: ObjectMap<MixedRelation[]> = {};

    queryResult.forEach((relation) => {
      if (!relationsMap[relation.personId.toString()]) {
        relationsMap[relation.personId.toString()] = [];
      }
      relationsMap[relation.personId.toString()].push(relation);
    }, {});

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
}
