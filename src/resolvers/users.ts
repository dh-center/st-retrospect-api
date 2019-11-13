import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';
import { multilingualRouteFields, Route } from './routes';
import { multilingualLocationFields } from './location';

interface User {
  _id: string;
  savedRoutes: Route[];
  savedRouteIds: ObjectId[];
  likedRoutes: Route[];
  likedRouteIds: ObjectId[];
}

const Query: BaseTypeResolver = {
  /**
   * Returns saved routes
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @param user - user access token
   * @return {object}
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
  async saveRoute(parent, { routeId }: {routeId: string}, { db, user }) {
    return (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) }, {
      $push: { savedRouteIds: new ObjectId(routeId) }
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
  async deleteRouteFromSaved(parent, { routeId }: {routeId: string}, { db, user }) {
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
  async likeRoute(parent, { routeId }: {routeId: string}, { db, user }) {
    return (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) },
      {
        $push: { likedRouteIds: new ObjectId(routeId) }
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
  async dislikeRoute(parent, { routeId }: {routeId: string}, { db, user }) {
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
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param _id - user id
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @return {object}
   */
  async savedRoutes({ _id }, data, { db, languages }) {
    const userData = (await db.collection<User>('users').aggregate([
      { $match: { _id: new ObjectId(_id) } },
      /**
       * If the savedRouteIds field is null, add empty array to this field
       */
      {
        $project: {
          savedRouteIds: { $ifNull: ['$savedRouteIds', [] ] }
        }
      },
      {
        /**
         * Aggregate saved routes
         */
        $lookup: {
          from: 'routes',
          /**
           * Specified variable to use in pipeline
           */
          let: { savedRouteIds: '$savedRouteIds' },
          pipeline: [
            /**
             * Find routes by ID
             */
            { $match: { $expr: { $in: ['$_id', '$$savedRouteIds'] } } },
            {
              /**
               * Aggregate locations in routes
               */
              $lookup: {
                from: 'locations',
                /**
                 * Specified variable to use in pipeline
                 */
                let: { locationIds: '$locationIds' },
                pipeline: [
                  /**
                   * Find locations by ID
                   */
                  { $match: { $expr: { $in: ['$_id', '$$locationIds'] } } }
                ],
                /**
                 * Save aggregated locations to the locations field
                 */
                as: 'locations'
              }
            }
          ],
          /**
           * Save aggregated routes to the savedRoutes field
           */
          as: 'savedRoutes'
        }
      }
    ]).toArray()).shift();

    if (userData) {
      if (!userData.savedRoutes) {
        return [];
      }

      userData.savedRoutes.map((route) => {
        filterEntityFields(route, languages, multilingualRouteFields);
        route.locations.map((location) => {
          filterEntityFields(location, languages, multilingualLocationFields);
          return location;
        });
        return route;
      });

      return userData.savedRoutes;
    }
  },

  /**
   * Returns liked routes
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param _id - user id
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @return {object}
   */
  async likedRoutes({ _id }, data, { db, languages }) {
    const userData = (await db.collection<User>('users').aggregate([
      { $match: { _id: new ObjectId(_id) } },
      /**
       * If the likedRouteIds field is null, add empty array to this field
       */
      {
        $project: {
          likedRouteIds: { $ifNull: ['$likedRouteIds', [] ] }
        }
      },
      {
        /**
         * Aggregate liked routes
         */
        $lookup: {
          from: 'routes',
          /**
           * Specified variable to use in pipeline
           */
          let: { likedRouteIds: '$likedRouteIds' },
          pipeline: [
            /**
             * Find routes by ID
             */
            { $match: { $expr: { $in: ['$_id', '$$likedRouteIds'] } } },
            {
              /**
               * Aggregate locations in routes
               */
              $lookup: {
                from: 'locations',
                /**
                 * Specified variable to use in pipeline
                 */
                let: { locationIds: '$locationIds' },
                pipeline: [
                  /**
                   * Find locations by ID
                   */
                  { $match: { $expr: { $in: ['$_id', '$$locationIds'] } } }
                ],
                /**
                 * Save aggregated locations to the locations field
                 */
                as: 'locations'
              }
            }
          ],
          /**
           * Save aggregated routes to the likedRoutes field
           */
          as: 'likedRoutes'
        }
      }
    ]).toArray()).shift();

    if (userData) {
      if (!userData.likedRoutes) {
        return [];
      }

      userData.likedRoutes.map((route) => {
        filterEntityFields(route, languages, multilingualRouteFields);
        route.locations.map((location) => {
          filterEntityFields(location, languages, multilingualLocationFields);
          return location;
        });
        return route;
      });

      return userData.likedRoutes;
    }
  }
};

export default {
  Query,
  User,
  Mutation
};
