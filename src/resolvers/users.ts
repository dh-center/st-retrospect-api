import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';
import { multilingualRouteFields, Route } from './routes';

/**
 * Stage for getting all routes
 */
const lookupRoutesStage = {
  $lookup: {
    from: 'routes',
    localField: 'routeIds',
    foreignField: '_id',
    as: 'routes'
  }
};

/**
 * Interface for saved and liked routes
 */
interface FeaturedRoutes {
  _id: ObjectId;
  userId: ObjectId;
  routes: Route[];
  routeIds: string[];
}

interface User {
  _id: string;
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
    const userData = await db.collection('users').findOne({ _id: new ObjectId(user.id) });

    await db.collection('saved-routes').updateOne({ userId: new ObjectId(userData._id) },
      {
        $set: {
          userId: new ObjectId(userData._id)
        },
        $push: { routeIds: new ObjectId(routeId) }
      },
      {
        upsert: true
      }
    );

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
    const userData = await db.collection('users').findOne({ _id: new ObjectId(user.id) });

    await db.collection('liked-routes').updateOne({ userId: new ObjectId(userData._id) },
      {
        $set: {
          userId: new ObjectId(userData._id)
        },
        $push: { routeIds: new ObjectId(routeId) }
      },
      {
        upsert: true
      }
    );

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
    const savedRoutes = (await db.collection<FeaturedRoutes>('saved-routes').aggregate([
      { $match: { userId: new ObjectId(_id) } },
      lookupRoutesStage
    ]).toArray()).shift();

    if (!savedRoutes) {
      return [];
    }

    savedRoutes.routes.map((route) => {
      filterEntityFields(route, languages, multilingualRouteFields);
      return route;
    });

    return savedRoutes.routes;
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
    const likedRoutes = (await db.collection<FeaturedRoutes>('liked-routes').aggregate([
      { $match: { userId: new ObjectId(_id) } },
      lookupRoutesStage
    ]).toArray()).shift();

    if (!likedRoutes) {
      return [];
    }

    likedRoutes.routes.map((route) => {
      filterEntityFields(route, languages, multilingualRouteFields);
      return route;
    });

    return likedRoutes.routes;
  }
};

export default {
  Query,
  User,
  Mutation
};
