import DataLoader from 'dataloader';
import { Db, ObjectId } from 'mongodb';
import { RelationDbScheme } from './resolvers/relations';

/**
 *
 * @param db
 * @param personIds
 */
async function batchRelationsByPersonId(db: Db, personIds: string[]): Promise<RelationDbScheme[][]> {
  const queryResult = await db.collection<RelationDbScheme>('relations')
    .find({ personId: { $in: personIds.map(id => new ObjectId(id)) } })
    .toArray();

  return personIds.map((personId) => {
    return queryResult.filter((relation) => {
      return relation.personId.toString() === personId.toString();
    });
  });
}

export interface DataLoaders {
  relationByPersonId: DataLoader<string, RelationDbScheme[]>;
}

/**
 *
 * @param db
 */
export default function (db: Db): DataLoaders {
  const relationByPersonId = new DataLoader(
    (personIds: string[]) => batchRelationsByPersonId(db, personIds)
  );

  return {
    relationByPersonId
  };
}
