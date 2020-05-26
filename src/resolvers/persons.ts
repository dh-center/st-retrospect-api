import { CreateMutationPayload, ResolverContextBase, UpdateMutationPayload } from '../types/graphql';
import { ObjectId } from 'mongodb';
import mergeWith from 'lodash.mergewith';

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
  async person(parent: undefined, { id }: { id: string }, { db }: ResolverContextBase): Promise<PersonDBScheme | null> {
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
    { input }: { input: PersonDBScheme & {id: string} },
    { db }: ResolverContextBase
  ): Promise<UpdateMutationPayload<PersonDBScheme>> {
    input._id = new ObjectId(input.id);
    const id = input._id;

    delete input.id;

    const originalPerson = await db.collection('persons').findOne({
      _id: id,
    });

    const person = await db.collection('persons').findOneAndUpdate(
      { _id: id },
      {
        $set: mergeWith(originalPerson, input, (original, inp) => inp === null ? original : undefined),
      },
      { returnOriginal: false });

    return {
      recordId: id,
      record: person.value,
    };
  },
};

const Mutation = {
  person: (): Record<string, undefined> => ({}),
};

export default {
  Query,
  Mutation,
  PersonMutations,
};
