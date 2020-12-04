import { ObjectId } from 'mongodb';
import { ResolverContextBase } from '../types/graphql';
import { RouteDBScheme } from './routes';

/**
 * Information about user in database
 */
export interface UserDBScheme {
  /**
   * User id
   */
  _id: ObjectId;

  /**
   * Username
   */
  username: string;

  /**
   * User password for logging in
   */
  password?: string;

  /**
   * User photo
   */
  photo?: string | null;

  /**
   * User email address
   */
  email?: string;

  /**
   * Is user with administrator privileges or not
   */
  isAdmin?: boolean;

  /**
   * User first name
   */
  firstName?: string | null;

  /**
   * User last name
   */
  lastName?: string | null;

  /**
   * Saved routes ids array
   */
  savedRouteIds?: ObjectId[] | null;

  /**
   * Liked routes ids array
   */
  likedRouteIds?: ObjectId[] | null;

  /**
   * Information about auth providers
   */
  auth?: {
    /**
     * Info about user's google account
     */
    google?: {
      /**
       * Google id of the user
       */
      id: string;
    }
  }
}

const Query = {
  /**
   * Returns saved routes
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async me(parent: undefined, args: undefined, { db, user }: ResolverContextBase): Promise<UserDBScheme| null> {
    return db.collection<UserDBScheme>('users').findOne({ _id: new ObjectId(user.id) });
  },
};

const Mutation = {
  /**
   * Add route to saved
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
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
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
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
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async likeRoute(parent: undefined, { routeId }: { routeId: string }, { db, user }: ResolverContextBase): Promise<UserDBScheme> {
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
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
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
   * @param user - resolved user from parent resolver
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async savedRoutes(user: UserDBScheme, args: undefined, { dataLoaders }: ResolverContextBase): Promise<RouteDBScheme[]> {
    if (!user.savedRouteIds) {
      return [];
    }

    const savedRoutes = await dataLoaders.routesById.loadMany(user.savedRouteIds.map(id => id.toString()));

    return savedRoutes.filter(Boolean) as RouteDBScheme[];
  },

  /**
   * Returns liked routes
   *
   * @param user - resolved user from parent resolver
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async likedRoutes(user: UserDBScheme, args: undefined, { dataLoaders }: ResolverContextBase): Promise<RouteDBScheme[]> {
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
