import { BaseTypeResolver } from '../types/graphql';
import { ObjectId } from 'mongodb';
import { filterEntityFields } from '../utils';
import { multilingualLocationFields } from './locations';
import { multilingualRelationFields } from './relations';

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

interface Person {
  id: string;
}

const Query: BaseTypeResolver = {
  /**
   * Returns specific person
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - person id
   * @param languages - languages in which return data
   * @param db - MongoDB connection to make queries
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
  async persons(parent, data, { db, languages }) {
    const persons = await db.collection('persons').find({}).toArray();

    persons.map((person) => {
      filterEntityFields(person, languages, multilingualPersonFields);
      person.id = person._id;
      return person;
    });
    return persons;
  }
};

const Person: BaseTypeResolver<Person> = {
  /**
   * Return all person relations
   * @param id - person's id that returned from the resolver on the parent field
   * @param languages - languages in which return data
   * @param db - MongoDB connection to make queries
   */
  async relations({ id }, data, { db, languages }) {
    const relations = await db.collection('relations').aggregate([
      {
        $match: {
          personId: new ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'persons',
          localField: 'personId',
          foreignField: '_id',
          as: 'person'
        }
      },
      {
        $unwind: '$person'
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'locationId',
          foreignField: '_id',
          as: 'location'
        }
      },
      {
        $unwind: '$location'
      },
      {
        $addFields: {
          person: {
            id: '$person._id'
          },
          location: {
            id: '$location._id'
          },
          id: '$_id'
        }
      }
    ]).toArray();

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
