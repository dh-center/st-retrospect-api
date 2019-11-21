import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';
import { multilingualRouteFields } from './routes';

interface User {
  /**
   * User id
   */
  _id: ObjectId;

  /**
   * Saved routes ids array
   */
  savedRouteIds: ObjectId[] | null;

  /**
   * Liked routes ids array
   */
  likedRouteIds: ObjectId[] | null;
}

const Query: BaseTypeResolver = {
  /**
   * Returns saved routes
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @param user - user access token
   */
  async me(parent, data, { db, user }) {
    return db.collection('users').findOne({ _id: new ObjectId(user.id) });
  }
};

const Mutation: BaseTypeResolver = {
  /**
   * Add route to saved
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param routeId - route id
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @param accessToken - user access token
   * @return {object}
   */
  async saveRoute(parent, { routeId }: { routeId: string }, { db, user }) {
    return (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) }, {
      $addToSet: { savedRouteIds: new ObjectId(routeId) }
    },
    {
      returnOriginal: false
    })).value;
  },

  /**
   * Delete route from saved
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param routeId - route id
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @param accessToken - user access token
   * @return {object}
   */
  async deleteRouteFromSaved(parent, { routeId }: { routeId: string }, { db, user }) {
    return (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) },
      {
        $pull: { savedRouteIds: new ObjectId(routeId) }
      },
      {
        returnOriginal: false
      })).value;
  },

  /**
   * Add route to liked
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param routeId - route id
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @param accessToken - user access token
   * @return {object}
   */
  async likeRoute(parent, { routeId }: { routeId: string }, { db, user }) {
    return (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) },
      {
        $addToSet: { likedRouteIds: new ObjectId(routeId) }
      },
      {
        returnOriginal: false
      })).value;
  },

  /**
   * Dislike route
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param routeId - route id
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @param accessToken - user access token
   * @return {object}
   */
  async dislikeRoute(parent, { routeId }: { routeId: string }, { db, user }) {
    return (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) },
      {
        $pull: { likedRouteIds: new ObjectId(routeId) }
      },
      {
        returnOriginal: false
      })).value;
  }
};

const User: BaseTypeResolver<User> = {
  /**
   * Returns saved routes
   * @param user - user for resolving
   * @param _id - user id
   * @param data - empty arg
   * @param dataLoaders - DataLoaders for fetching data
   * @param languages - languages in which return data
   */
  async savedRoutes(user, data, { dataLoaders, languages }) {
    if (!user.savedRouteIds) {
      return [];
    }

    const savedRoutes = await dataLoaders.routesById.loadMany(user.savedRouteIds.map(id => id.toString()));

    return savedRoutes.filter((route) => {
      if (!route) {
        return false;
      }

      filterEntityFields(route, languages, multilingualRouteFields);

      return true;
    });
  },

  /**
   * Returns liked routes
   * @param user - user for resolving
   * @param _id - user id
   * @param data - empty arg
   * @param dataLoaders - DataLoaders for fetching data
   * @param languages - languages in which return data
   */
  async likedRoutes(user, data, { languages, dataLoaders }) {
    if (!user.likedRouteIds) {
      return [];
    }

    const likedRoutes = await dataLoaders.routesById.loadMany(user.likedRouteIds.map(id => id.toString()));

    return likedRoutes.filter((route) => {
      if (!route) {
        return false;
      }
      filterEntityFields(route, languages, multilingualRouteFields);

      return true;
    });
  }
};

export default {
  Query,
  User,
  Mutation
};
