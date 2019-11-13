import DataLoader from 'dataloader';
import { Db, ObjectId } from 'mongodb';
import { MixedRelation } from './resolvers/relations';

/**
 * Batching function for resolving relations from persons ids
 * @param db - MongoDB connection to make queries
 * @param personIds - persons ids for resolving
 */
async function batchRelationsByPersonId(db: Db, personIds: string[]): Promise<MixedRelation[][]> {
  const queryResult = await db.collection<MixedRelation>('relations')
    .aggregate([
      {
        $match: { personId: { $in: personIds.map(id => new ObjectId(id)) } }
      },
      {
        $lookup: {
          from: 'persons',
          localField: 'personId',
          foreignField: '_id',
          as: 'person'
        }
      },
      {
        $unwind: '$person'
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

  const relationsMap: {[key: string]: MixedRelation[]} = {};

  queryResult.forEach((relation) => {
    if (!relationsMap[relation.personId.toString()]) {
      relationsMap[relation.personId.toString()] = [];
    }
    relationsMap[relation.personId.toString()].push(relation);
  }, {});

  return personIds.map((personId) => relationsMap[personId] || []);
}

/**
 * Available DataLoaders for data fetching
 */
export interface DataLoaders {
  relationByPersonId: DataLoader<string, MixedRelation[]>;
}

/**
 * Function for setting up dataLoaders
 * @param db - MongoDB connection to make queries
 */
export default function (db: Db): DataLoaders {
  const relationByPersonId = new DataLoader(
    (personIds: string[]) => batchRelationsByPersonId(db, personIds)
  );

  return {
    relationByPersonId
  };
}
