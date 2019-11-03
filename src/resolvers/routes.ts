import { BaseTypeResolver, PointCoordinates } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';
import { multilingualLocationFields, Locations } from './locations';
import distance from '../utils/distance';

/**
 * Multilingual route fields
 */
const multilingualRouteFields = [
  'name',
  'description'
];

/**
 * Input type to search routes
 */
interface RoutesFilter {
  /**
   * String for searching in all languages
   */
  contains: string;
}

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
interface Route {
  _id: ObjectId;
  locations: Locations[];
  locationIds: string[];
}

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
   * @param languages - languages in which return data
   * @return {object}
   */
  async route(parent, { id }: { id: string }, { db, languages }) {
    const route = (await db.collection<Route>('routes').aggregate([
      { $match: { _id: new ObjectId(id) } },
      lookupLocationsStage
    ]).toArray()).shift();

    if (!route) {
      return null;
    }

    filterEntityFields(route, languages, multilingualRouteFields);

    route.locations.map((location) => {
      filterEntityFields(location, languages, multilingualLocationFields);
    });

    return route;
  },

  /**
   * Returns all routes
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param filter - search filter
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @return {object[]}
   */
  async routes(parent, { filter }: { filter?: RoutesFilter }, { db, languages }) {
    const aggregationPipeline: object[] = [
      lookupLocationsStage
    ];

    if (filter) {
      aggregationPipeline.unshift(getMatchStageFromFilter(filter));
    }

    const routes = await db.collection<Route>('routes').aggregate(aggregationPipeline).toArray();

    routes.map((route) => {
      filterEntityFields(route, languages, multilingualRouteFields);

      route.locations.map((location) => {
        filterEntityFields(location, languages, multilingualLocationFields);
      });

      return route;
    });
    return routes;
  },

  /**
   * Returns nearest routes
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param center - center coordinates
   * @param radius - search radius
   * @param filter - search filter
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   */
  async nearestRoutes(
    parent,
    { center, radius, filter }: { center: PointCoordinates; radius: number; filter?: RoutesFilter },
    { db, languages }
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

        if (location.coordinateY && location.coordinateX) {
          const metresInKilometres = 1000;

          if (metresInKilometres * distance(location.coordinateX, location.coordinateY, center.latitude, center.longitude) <= radius) {
            isValid = true;
          }
        }
        filterEntityFields(location, languages, multilingualLocationFields);
      });

      if (isValid) {
        filterEntityFields(route, languages, multilingualRouteFields);
      }
      return isValid;
    });
    return routes;
  }
};

export default {
  Query
};
