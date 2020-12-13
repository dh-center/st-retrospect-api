import type { Db, MongoClientOptions, Collection } from 'mongodb';
import { MongoClient, Logger } from 'mongodb';
import type { Collections } from './types/graphql';

const connectionConfig: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let connection: Db | undefined;

let logCount = 0;

/**
 * Setups connections to the database
 */
export default async function getConnection(): Promise<Db> {
  if (!connection) {
    if (process.env.MONGODB_ENABLE_LOGGING) {
      Logger.setCurrentLogger((msg) => {
        console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`);
      });
      Logger.setLevel('debug');
      Logger.filter('class', [ 'Cursor' ]);
    }

    connection = (await MongoClient.connect(process.env.MONGODB_URL as string, connectionConfig)).db();
  }

  return connection;
}

/**
 * Function for direct access to collections
 *
 * @param name - collection name
 */
export async function getCollection<T extends keyof Collections>(name: T): Promise<Collection<Collections[T]>> {
  return (await getConnection()).collection(name);
}
