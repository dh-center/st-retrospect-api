import {
  CreateMutationPayload,
  DeleteMutationPayload,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { ObjectId } from 'mongodb';
import mergeWith from 'lodash.mergewith';
import sendNotify from '../utils/telegramNotify';

export interface PersonDBScheme {
  _id: ObjectId;
}

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
    { db, user }: ResolverContextBase
  ): Promise<CreateMutationPayload<PersonDBScheme>> {
    const person = (await db.collection<PersonDBScheme>('persons').insertOne(input)).ops[0];

    await sendNotify('Person', 'persons', db, user, 'create', input);

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
    { db, user }: ResolverContextBase
  ): Promise<UpdateMutationPayload<PersonDBScheme>> {
    input._id = new ObjectId(input.id);
    const id = input._id;

    delete input.id;

    const originalPerson = await db.collection('persons').findOne({
      _id: id,
    });

    await sendNotify('Person', 'persons', db, user, 'update', input, 'persons');

    const person = await db.collection('persons').findOneAndUpdate(
      { _id: id },
      {
        $set: mergeWith(originalPerson, input, (original, inp) => {
          if (inp === null) {
            return original;
          }
          if (Array.isArray(original)) {
            return inp;
          }

          return undefined;
        }),
      },
      { returnOriginal: false });

    return {
      recordId: id,
      record: person.value,
    };
  },

  /**
   * Delete person
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param id - object id
   * @param db - MongoDB connection to make queries
   * @returns {object}
   */
  async delete(
    parent: undefined,
    { id }: { id: string },
    { db, user }: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
    const originalPerson = await db.collection('persons').findOne({
      _id: id,
    });

    await sendNotify('Person', 'persons', db, user, 'delete', originalPerson);

    await db.collection<PersonDBScheme>('persons').deleteOne({ _id: new ObjectId(id) });

    return {
      recordId: new ObjectId(id),
    };
  },
};

const Mutation = {
  person: (): Record<string, undefined> => ({}),
};

export default {
  Mutation,
  PersonMutations,
};
