import { Db, MongoClient, MongoClientOptions, Logger } from 'mongodb';

const connectionConfig: MongoClientOptions = {
  useNewUrlParser: true,
  reconnectTries: +(process.env.MONGO_RECONNECT_TRIES || 60),
  reconnectInterval: +(process.env.MONGO_RECONNECT_INTERVAL || 1000),
  autoReconnect: true,
  useUnifiedTopology: true,
};

let connection: Db;

let logCount = 0;

/**
 * Setups connections to the database
 *
 * @returns {Promise<Db>}
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
