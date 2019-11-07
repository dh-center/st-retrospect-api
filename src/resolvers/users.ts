import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';
import { multilingualRouteFields, Route } from './routes';
import { multilingualLocationFields } from './locations';

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
  async me(parent, data, { db, languages, user }) {
    const userData = await db.collection('users').findOne({ _id: new ObjectId(user.id) });

    return userData;
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
  async saveRoute(parent, { routeId }: {routeId: string}, { db, languages, user }) {
    const userData = (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) }, {
      $push: { savedRouteIds: new ObjectId(routeId) }
    },
    {
      returnOriginal: false
    })).value;

    return userData;
  },

  /**
   * Unsave route
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param routeId - route id
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @param accessToken - user access token
   * @return {object}
   */
  async unsaveRoute(parent, { routeId }: {routeId: string}, { db, languages, user }) {
    const userData = (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) },
      {
        $pull: { savedRouteIds: new ObjectId(routeId) }
      },
      {
        returnOriginal: false
      })).value;

    return userData;
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
  async likeRoute(parent, { routeId }: {routeId: string}, { db, languages, user }) {
    const userData = (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) },
      {
        $push: { likedRouteIds: new ObjectId(routeId) }
      },
      {
        returnOriginal: false
      })).value;

    return userData;
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
  async dislikeRoute(parent, { routeId }: {routeId: string}, { db, languages, user }) {
    const userData = (await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user.id) },
      {
        $pull: { likedRouteIds: new ObjectId(routeId) }
      },
      {
        returnOriginal: false
      })).value;

    return userData;
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
      {
        $lookup: {
          from: 'routes',
          let: { savedRouteIds: '$savedRouteIds' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$savedRouteIds'] } } },
            {
              $lookup: {
                from: 'locations',
                let: { locationIds: '$locationIds' },
                pipeline: [
                  { $match: { $expr: { $in: ['$_id', '$$locationIds'] } } }
                ],
                as: 'locations'
              }
            }
          ],
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
      {
        $lookup: {
          from: 'routes',
          let: { likedRouteIds: '$likedRouteIds' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$likedRouteIds'] } } },
            {
              $lookup: {
                from: 'locations',
                let: { locationIds: '$locationIds' },
                pipeline: [
                  { $match: { $expr: { $in: ['$_id', '$$locationIds'] } } }
                ],
                as: 'locations'
              }
            }
          ],
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
