import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';
import { PersonDBScheme } from './persons';

/**
 * Multilingual location fields
 */
export const multilingualLocationFields = [
  'name',
  'description'
];

// @todo improve tipization
export interface Location {
  /**
   * Id of location
   */
  _id: ObjectId;

  /**
   * Latitude of the location
   */
  coordinateX: number;

  /**
   * Longitude of the location
   */
  coordinateY: number;
}

export interface LocationDBScheme {
  _id: ObjectId;
}

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
      return location;
    });
    return locations;
  },

  /**
   * Returns all locations
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @return {object[]}
   */
  async search(parent, { searchString }: {searchString: string}, { db, languages, dataLoaders }) {
    const searchRegExp = new RegExp(searchString, 'i');
    const persons = await db.collection<PersonDBScheme>('persons').find({
      $or: [
        { 'lastName.ru': searchRegExp },
        { 'lastName.en': searchRegExp }
      ]
    }).toArray();
    const personsIds = persons.map(person => person._id.toString());

    const relations = await dataLoaders.relationByPersonId.loadMany(personsIds);
    const locationsIds = relations
      .flat()
      .map(relation => relation.locationId.toString());

    const locations = await dataLoaders.locationById.loadMany(locationsIds);

    return locations.filter((location) => {
      if (!location) {
        return false;
      }

      filterEntityFields(location, languages, multilingualLocationFields);

      return true;
    }) as LocationDBScheme[];
  }
};

export default {
  Query
};
