/**
 * @file migrate-mongo configuration
 */

const dotenv = require('dotenv');
dotenv.config();

/**
 * Get DataBase name and connection URL from full MongoDB connection URL
 * For example: 'mongodb://mongodb:27017/retrospect' splitted on 'retrospect' and 'mongodb://mongodb:27017'
 */
const mongodbUrlSplitted = process.env.MONGODB_URL.split('/');
const databaseName = mongodbUrlSplitted.pop();
const connectionUrl = mongodbUrlSplitted.join('/');


const config = {
  mongodb: {
    url: connectionUrl,

    databaseName: databaseName,

    options: {
      useNewUrlParser: true,
      reconnectTries: +(process.env.MONGO_RECONNECT_TRIES || 60),
      reconnectInterval: +(process.env.MONGO_RECONNECT_INTERVAL || 1000),
      autoReconnect: true,
      useUnifiedTopology: true
    }
  },

  /**
   * The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
   */
  migrationsDir: "migrations",

  /**
   * The mongodb collection where the applied changes are stored. Only edit this when really necessary.
   */
  changelogCollectionName: "changelog"
};

module.exports = config;
