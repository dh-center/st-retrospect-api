import { CreateMutationPayload, ResolverContextBase, UpdateMutationPayload } from '../types/graphql';
import { ObjectId } from 'mongodb';
import merge from 'lodash.merge';

export interface PersonDBScheme {
  _id: ObjectId;
}

const Query = {
  /**
   * Returns specific person
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - person id
   * @param db - MongoDB connection to make queries
   * @returns {object}
   */
  async person(parent: {}, { id }: { id: string }, { db }: ResolverContextBase): Promise<PersonDBScheme | null> {
    const person = await db.collection('persons').findOne({
      _id: new ObjectId(id),
    });

    if (!person) {
      return null;
    }

    return person;
  },
};

const PersonMutations = {
  /**
   * Create new person
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - person object
   * @param db - MongoDB connection to make queries
   * @returns {object}
   */
  async create(
    parent: undefined,
    { input }: { input: PersonDBScheme },
    { db }: ResolverContextBase
  ): Promise<CreateMutationPayload<PersonDBScheme>> {
    const person = (await db.collection<PersonDBScheme>('persons').insertOne(input)).ops[0];

    return {
      recordId: person._id,
      record: person,
    };
  },

  /**
   * Update person
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param input - person object
   * @param db - MongoDB connection to make queries
   * @returns {object}
   */
  async update(
    parent: undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { input }: { input: PersonDBScheme },
    { db }: ResolverContextBase
  ): Promise<UpdateMutationPayload<PersonDBScheme>> {
    const id = input._id;

    delete input._id;

    const originalPerson = await db.collection('persons').findOne({
      _id: new ObjectId(id),
    });

    const person = await db.collection('persons').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: merge(originalPerson, input),
      },
      { returnOriginal: false });

    return {
      recordId: id,
      record: person.value,
    };
  },
};

const Mutation = {
  person: (): object => ({}),
};

export default {
  Query,
  Mutation,
  PersonMutations,
};
