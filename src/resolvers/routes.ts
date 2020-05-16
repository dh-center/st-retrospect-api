import { BaseTypeResolver, PointCoordinates } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { LocationDBScheme } from './locations';
import distance from '../utils/distance';

export interface RouteDBScheme {
  /**
   * Route id
   */
  _id: ObjectId;

  /**
   * Locations making up the route
   */
  locationInstanceIds: ObjectId[];
}

/**
 * Input type to search routes
 */
interface RoutesFilter {
  /**
   * String for searching in all languages
   */
  contains: string;
}

/**
 * Returns match stage for MongoDB aggregation form Routes filter
 * @param filter - search filter
 */
function getMatchStageFromFilter(filter: RoutesFilter): object {
  const searchRegExp = new RegExp(filter.contains, 'i');

  return {
    $match: {
      $or: [
        { 'name.ru': searchRegExp },
        { 'name.en': searchRegExp }
      ]
    }
  };
}

// @todo improve tipization
export interface Route {
  _id: ObjectId;
  locations: LocationDBScheme[];
  locationIds: string[];
}

/**
 * Stage for getting all locations of route
 */
const lookupLocationsStage = {
  $lookup: {
    from: 'locations',
    localField: 'locationIds',
    foreignField: '_id',
    as: 'locations'
  }
};

const Query: BaseTypeResolver = {
  /**
   * Returns specific route
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - route id
   * @param db - MongoDB connection to make queries
   * @return {object}
   */
  async route(parent, { id }: { id: string }, { db }) {
    const route = (await db.collection<Route>('routes').aggregate([
      { $match: { _id: new ObjectId(id) } },
      lookupLocationsStage
    ]).toArray()).shift();

    if (!route) {
      return null;
    }

    return route;
  },

  /**
   * Returns all routes
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param filter - search filter
   * @param db - MongoDB connection to make queries
   * @return {object[]}
   */
  async routes(parent, { filter }: { filter?: RoutesFilter }, { db }) {
    const aggregationPipeline: object[] = [
      lookupLocationsStage
    ];

    if (filter) {
      aggregationPipeline.unshift(getMatchStageFromFilter(filter));
    }

    return db.collection<Route>('routes').aggregate(aggregationPipeline).toArray();
  },

  /**
   * Returns nearest routes
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param center - center coordinates
   * @param radius - search radius
   * @param filter - search filter
   * @param db - MongoDB connection to make queries
   */
  async nearestRoutes(
    parent,
    { center, radius, filter }: { center: PointCoordinates; radius: number; filter?: RoutesFilter },
    { db }
  ) {
    const aggregationPipeline: object[] = [
      lookupLocationsStage
    ];

    if (filter) {
      aggregationPipeline.unshift(getMatchStageFromFilter(filter));
    }

    let routes = await db.collection<Route>('routes')
      .aggregate(aggregationPipeline)
      .toArray();

    routes = routes.filter((route) => {
      let isValid = false;

      route.locations.forEach((location) => {
        if (isValid) {
          return;
        }

        /**
         * Check distance to location
         */
        if (location.coordinateY && location.coordinateX) {
          const metresInKilometres = 1000;

          if (metresInKilometres * distance(location.coordinateX, location.coordinateY, center.latitude, center.longitude) <= radius) {
            isValid = true;
          }
        }
      });

      return isValid;
    });
    return routes;
  }
};

export default {
  Query
};
