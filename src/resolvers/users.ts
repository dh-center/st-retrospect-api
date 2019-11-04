import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';
import { multilingualRouteFields, Route } from './routes';
import jwt from 'jsonwebtoken';

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
 * Stage for getting all locations of route
 */
const lookupLocationsStage = {
  $lookup: {
    from: 'locations',
    localField: 'routes.locationIds',
    foreignField: '_id',
    as: 'locations'
  }
};

interface SavedRoutes {
  _id: ObjectId;
  userId: ObjectId;
  routes: Route[];
  routeIds: string[];
}

interface User {
  _id: string;
}

interface AccessToken {
  id: string;
  isAdmin: boolean;
}

const Query: BaseTypeResolver = {
  /**
   * Returns saved routes
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @param accessToken - user access token
   * @return {object}
   */
  async me(parent, data, { db, languages, accessToken }) {
    const jsonToken = await jwt.verify(accessToken, process.env.JWT_SECRET_STRING || 'secret_string') as AccessToken;
    const user = await db.collection('users').findOne({ _id: new ObjectId(jsonToken.id) });

    return user;
  }
};

const User: BaseTypeResolver<User> = {
  /**
   * Returns saved routes
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - user id
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @return {object}
   */
  async savedRoutes({ _id }, data, { db, languages }) {
    const savedRoutes = (await db.collection<SavedRoutes>('savedroutes').aggregate([
      { $match: { userId: new ObjectId(_id) } },
      lookupRoutesStage,
      lookupLocationsStage
    ]).toArray()).shift();

    if (!savedRoutes) {
      return null;
    }

    savedRoutes.routes.map((route) => {
      filterEntityFields(route, languages, multilingualRouteFields);
      return route;
    });

    return savedRoutes.routes;
  }
};

export default {
  Query,
  User
};
