import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';
import { multilingualLocationFields, Locations } from './locations';

/**
 * Multilingual route fields
 */
const multilingualRouteFields = [
  'name',
  'description'
];

interface RoutesFilter {
  contains: string;
}

// @todo improve tipization
interface Route {
  _id: ObjectId;
  locations: Locations[];
  locationIds: string[];
}

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
      {
        $lookup: {
          from: 'locations',
          localField: 'locationIds',
          foreignField: '_id',
          as: 'locations'
        }
      }
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
      {
        $lookup: {
          from: 'locations',
          localField: 'locationIds',
          foreignField: '_id',
          as: 'locations'
        }
      }
    ];

    if (filter) {
      const searchRegExp = new RegExp(filter.contains, 'i');
      const matchStage = {
        $match: {
          $or: [
            { 'name.ru': searchRegExp },
            { 'name.en': searchRegExp }
          ]
        }
      };

      aggregationPipeline.unshift(matchStage);
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
  }
};

export default {
  Query
};
