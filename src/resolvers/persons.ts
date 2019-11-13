import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';
import { multilingualLocationFields } from './location';
import {multilingualRelationFields, RelationDbScheme, RelationGraphQLScheme} from './relations';

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

export interface Person {
  _id: ObjectId;
}

const Query: BaseTypeResolver = {
  /**
   * Returns specific person
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - person id
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @return {object}
   */
  async person(parent, { id }: { id: string }, { db, languages }) {
    const person = await db.collection('persons').findOne({
      _id: new ObjectId(id)
    });

    if (!person) {
      return null;
    }

    filterEntityFields(person, languages, multilingualPersonFields);

    return person;
  },

  /**
   * Returns all locations
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param data - empty arg
   * @param db - MongoDB connection to make queries
   * @param languages - languages in which return data
   * @return {object[]}
   */
  async persons(parent, data, { db, languages }) {
    const persons = await db.collection('persons').find({}).toArray();

    persons.map((person) => {
      filterEntityFields(person, languages, multilingualPersonFields);
      return person;
    });
    return persons;
  }
};

const Person: BaseTypeResolver<Person> = {
  /**
   * Return all person relations
   * @param _id - person's id that returned from the resolver on the parent field
   * @param data - empty arg
   * @param languages - languages in which return data
   * @param dataLoaders - DataLoaders for fetching data
   * @return {object[]}
   */
  async relations({ _id }, data, { languages, dataLoaders }) {
    const relations = await dataLoaders.relationByPersonId.load(_id.toString());

    relations.map((relation) => {
      filterEntityFields(relation, languages, multilingualRelationFields);
      filterEntityFields(relation.person, languages, multilingualPersonFields);
      filterEntityFields(relation.location, languages, multilingualLocationFields);
      return relation;
    });

    return relations;
  }
};

export default {
  Query,
  Person
};
