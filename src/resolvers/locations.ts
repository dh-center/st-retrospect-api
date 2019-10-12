import { BaseTypeResolver, Languages } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';

/**
 * Multilingual location fields
 */
const multilingualPersonFields = [
  'name',
  'description',
  'constructionDate',
  'demolitionDate'
];

const Query: BaseTypeResolver = {
  /**
   * Returns specific location
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - location id
   * @param languages - languages in which return data
   * @param db - MongoDB connection to make queries
   * @return {object}
   */
  async location(parent, { id, languages }: { id: string; languages: Languages[] }, { db }) {
    const location = await db.collection('locations').findOne({
      _id: new ObjectId(id)
    });

    if (!location) {
      return null;
    }

    filterEntityFields(location, languages, multilingualPersonFields);

    // @todo move to directive
    location.id = location._id;
    return location;
  },

  /**
   * Returns all locations
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param languages - languages in which return data
   * @param db - MongoDB connection to make queries
   * @return {object[]}
   */
  async locations(parent, { languages }: {languages: Languages[]}, { db }) {
    const locations = await db.collection('locations').find({}).toArray();

    locations.map((location) => {
      filterEntityFields(location, languages, multilingualPersonFields);
      location.id = location._id;
      return location;
    });
    return locations;
  }
};

export default {
  Query
};
