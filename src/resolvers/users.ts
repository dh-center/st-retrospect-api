import { ObjectId } from 'mongodb';
import { ResolverContextBase } from '../types/graphql';
import { RouteDBScheme } from './routes';

interface UserDBScheme {
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

const Query = {
  /**
   * Returns saved routes
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @param user - user access token
   */
  async me(parent: undefined, data: undefined, { db, user }: ResolverContextBase): Promise<UserDBScheme| null> {
    return db.collection<UserDBScheme>('users').findOne({ _id: new ObjectId(user.id) });
  },
};

const Mutation = {
  /**
   * Add route to saved
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param routeId - route id
   * @param db - MongoDB connection to make queries
   * @param user - user access token
   */
  async saveRoute(parent: undefined, { routeId }: { routeId: string }, { db, user }: ResolverContextBase): Promise<UserDBScheme> {
    return (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) }, {
      $addToSet: { savedRouteIds: new ObjectId(routeId) },
    },
    {
      returnOriginal: false,
    })).value;
  },

  /**
   * Delete route from saved
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param routeId - route id
   * @param db - MongoDB connection to make queries
   * @param user - user access token
   * @param accessToken - user access token
   * @returns {object}
   */
  async deleteRouteFromSaved(parent: undefined, { routeId }: { routeId: string }, { db, user }: ResolverContextBase): Promise<UserDBScheme> {
    return (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) },
      {
        $pull: { savedRouteIds: new ObjectId(routeId) },
      },
      {
        returnOriginal: false,
      })).value;
  },

  /**
   * Add route to liked
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param routeId - route id
   * @param db - MongoDB connection to make queries
   * @param user - user access token
   * @param accessToken - user access token
   * @returns {object}
   */
  async likeRoute(parent: undefined, { routeId }: { routeId: string }, { db, user }: ResolverContextBase):Promise<UserDBScheme> {
    return (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) },
      {
        $addToSet: { likedRouteIds: new ObjectId(routeId) },
      },
      {
        returnOriginal: false,
      })).value;
  },

  /**
   * Dislike route
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param routeId - route id
   * @param db - MongoDB connection to make queries
   * @param user - user access token
   * @param accessToken - user access token
   * @returns {object}
   */
  async dislikeRoute(parent: undefined, { routeId }: { routeId: string }, { db, user }: ResolverContextBase): Promise<UserDBScheme> {
    return (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) },
      {
        $pull: { likedRouteIds: new ObjectId(routeId) },
      },
      {
        returnOriginal: false,
      })).value;
  },
};

const User = {
  /**
   * Returns saved routes
   *
   * @param user - user for resolving
   * @param data - empty arg
   * @param dataLoaders - DataLoaders for fetching data
   */
  async savedRoutes(user: UserDBScheme, data: undefined, { dataLoaders }: ResolverContextBase): Promise<RouteDBScheme[]> {
    if (!user.savedRouteIds) {
      return [];
    }

    const savedRoutes = await dataLoaders.routesById.loadMany(user.savedRouteIds.map(id => id.toString()));

    return savedRoutes.filter(Boolean) as RouteDBScheme[];
  },

  /**
   * Returns liked routes
   *
   * @param user - user for resolving
   * @param _id - user id
   * @param data - empty arg
   * @param dataLoaders - DataLoaders for fetching data
   */
  async likedRoutes(user: UserDBScheme, data: undefined, { dataLoaders }: ResolverContextBase): Promise<RouteDBScheme[]> {
    if (!user.likedRouteIds) {
      return [];
    }

    const likedRoutes = await dataLoaders.routesById.loadMany(user.likedRouteIds.map(id => id.toString()));

    return likedRoutes.filter(Boolean) as RouteDBScheme[];
  },
};

export default {
  Query,
  User,
  Mutation,
};
