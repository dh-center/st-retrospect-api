import {
  CreateMutationPayload,
  DeleteMutationPayload,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { ObjectId } from 'mongodb';
import mergeWith from 'lodash.mergewith';
import sendNotify from '../utils/telegramNotify';
import { UpdatePersonInput } from '../generated/graphql';

export interface PersonDBScheme {
  _id: ObjectId;
}

const PersonMutations = {
  /**
   * Create new person
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
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
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
   */
  async update(
    parent: undefined,
    { input }: { input: UpdatePersonInput },
    { db, user }: ResolverContextBase
  ): Promise<UpdateMutationPayload<PersonDBScheme>> {
    const newInput = {
      _id: new ObjectId(input.id),
      ...input,
      id: undefined,
    };

    const originalPerson = await db.collection('persons').findOne({
      _id: newInput._id,
    });

    await sendNotify('Person', 'persons', db, user, 'update', newInput, 'persons');

    const person = await db.collection('persons').findOneAndUpdate(
      { _id: newInput._id },
      {
        $set: mergeWith(originalPerson, newInput, (original, inp) => {
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
      recordId: newInput._id,
      record: person.value,
    };
  },

  /**
   * Delete person
   *
   * @param parent - this is the return value of the resolver for this field's parent
   * @param args - contains all GraphQL arguments provided for this field
   * @param context - this object is shared across all resolvers that execute for a particular operation
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
