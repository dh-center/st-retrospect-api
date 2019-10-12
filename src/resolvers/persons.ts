import { BaseTypeResolver, Languages } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';

/**
 * Multilingual person fields
 */
const multilingualPersonFields = [
  'firstName',
  'lastName',
  'patronymic',
  'pseudonym',
  'profession',
  'description'
];

const Query: BaseTypeResolver = {
  /**
   * Returns specific person
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - person id
   * @param languages - languages in which return data
   * @param db - MongoDB connection to make queries
   * @return {object}
   */
  async person(parent, { id, languages }: { id: string; languages: Languages[] }, { db }) {
    const person = await db.collection('persons').findOne({
      _id: new ObjectId(id)
    });

    if (!person) {
      return null;
    }

    filterEntityFields(person, languages, multilingualPersonFields);

    // @todo move to directive
    person.id = person._id;
    return person;
  },

  /**
   * Returns all locations
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param languages - languages in which return data
   * @param db - MongoDB connection to make queries
   * @return {object[]}
   */
  async persons(parent, { languages }: {languages: Languages[]}, { db }) {
    const persons = await db.collection('persons').find({}).toArray();

    persons.map((person) => {
      filterEntityFields(person, languages, multilingualPersonFields);
      person.id = person._id;
      return person;
    });
    return persons;
  }
};

export default {
  Query
};
