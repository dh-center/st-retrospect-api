import { PointCoordinates, ResolverContextBase } from '../types/graphql';
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

export type RouteWithLocations = RouteDBScheme & {
  locations: LocationDBScheme[];
};

/**
 * Returns match stage for MongoDB aggregation form Routes filter
 *
 * @param filter - search filter
 */
function getMatchStageFromFilter(filter: RoutesFilter): Record<string, unknown> {
  const searchRegExp = new RegExp(filter.contains, 'i');

  return {
    $match: {
      $or: [
        { 'name.ru': searchRegExp },
        { 'name.en': searchRegExp },
      ],
    },
  };
}

/**
 * Stage for getting all locations of route
 */
const lookupLocationsStage = {
  $lookup: {
    from: 'locations',
    localField: 'locationIds',
    foreignField: '_id',
    as: 'locations',
  },
};

const Query = {
  /**
   * Returns specific route
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - route id
   * @param db - MongoDB connection to make queries
   * @returns {object}
   */
  async route(parent: undefined, { id }: { id: string }, { db }: ResolverContextBase): Promise<RouteDBScheme | null> {
    const route = await db.collection<RouteDBScheme>('routes').findOne({
      _id: new ObjectId(id),
    });

    if (!route) {
      return null;
    }

    return route;
  },

  /**
   * Returns all routes
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param filter - search filter
   * @param db - MongoDB connection to make queries
   * @returns {object[]}
   */
  async routes(parent: undefined, { filter }: { filter?: RoutesFilter }, { db }: ResolverContextBase): Promise<RouteWithLocations[]> {
    const aggregationPipeline: Record<string, unknown>[] = [
      lookupLocationsStage,
    ];

    if (filter) {
      aggregationPipeline.unshift(getMatchStageFromFilter(filter));
    }

    return db.collection<RouteDBScheme>('routes')
      .aggregate<RouteWithLocations>(aggregationPipeline)
      .toArray();
  },

  /**
   * Returns nearest routes
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param center - center coordinates
   * @param radius - search radius
   * @param filter - search filter
   * @param db - MongoDB connection to make queries
   */
  async nearestRoutes(
    parent: undefined,
    { center, radius, filter }: { center: PointCoordinates; radius: number; filter?: RoutesFilter },
    { db }: ResolverContextBase
  ): Promise<RouteWithLocations[]> {
    const aggregationPipeline: Record<string, unknown>[] = [
      lookupLocationsStage,
    ];

    if (filter) {
      aggregationPipeline.unshift(getMatchStageFromFilter(filter));
    }

    let routes = await db.collection<RouteDBScheme>('routes')
      .aggregate<RouteWithLocations>(aggregationPipeline)
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
  },
};

export default {
  Query,
};
