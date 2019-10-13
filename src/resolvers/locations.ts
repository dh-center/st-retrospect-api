import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';

/**
 * Multilingual location fields
 */
export const multilingualLocationFields = [
  'name',
  'description'
];

const Query: BaseTypeResolver = {
  /**
   * Returns specific location
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - location id
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @return {object}
   */
  async location(parent, { id }: { id: string }, { db, languages }) {
    const location = await db.collection('locations').findOne({
      _id: new ObjectId(id)
    });

    if (!location) {
      return null;
    }

    filterEntityFields(location, languages, multilingualLocationFields);

    // @todo move to directive
    location.id = location._id;
    return location;
  },

  /**
   * Returns all locations
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @return {object[]}
   */
  async locations(parent, data, { db, languages }) {
    const locations = await db.collection('locations').find({}).toArray();

    locations.map((location) => {
      filterEntityFields(location, languages, multilingualLocationFields);
      location.id = location._id;
      return location;
    });
    return locations;
  }
};

export default {
  Query
};
