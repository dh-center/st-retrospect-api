import { Db, MongoClient, MongoClientOptions } from 'mongodb';

const connectionConfig: MongoClientOptions = {
  useNewUrlParser: true,
  reconnectTries: +(process.env.MONGO_RECONNECT_TRIES || 60),
  reconnectInterval: +(process.env.MONGO_RECONNECT_INTERVAL || 1000),
  autoReconnect: true,
  useUnifiedTopology: true
};

/**
 * Setups connections to the database
 * @return {Promise<Db>}
 */
export default async function getConnection(): Promise<Db> {
  return (await MongoClient.connect(process.env.MONGODB_URL as string, connectionConfig)).db();
};
