import {
  CreateMutationPayload,
  DeleteMutationPayload, MultilingualString,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { ObjectId } from 'mongodb';
import mergeWith from 'lodash.mergewith';
import sendNotify from '../utils/telegramNotify';
import { CreatePersonInput, UpdatePersonInput } from '../generated/graphql';
import mapArrayInputToMultilingual from '../utils/mapStringsArrayToMultilingual';

export interface PersonDBScheme {
  _id: ObjectId;
  /**
   * Person's last name
   */
  lastName?: string | null;

  /**
   * Person's first name
   */
  firstName?: string | null;

  /**
   * Person's patronymic
   */
  patronymic?: string | null;

  /**
   * Person's pseudonym
   */
  pseudonym?: string | null;

  /**
   * Person's professions
   */
  professions?: MultilingualString[];

  /**
   * Person's description
   */
  description?: string | null;

  /**
   * Person's birth date
   */
  birthDate?: string | null;

  /**
   * Person's death date
   */
  deathDate?: string | null;

  /**
   * Person's info link
   */
  wikiLink?: string | null;
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
    { input }: { input: CreatePersonInput },
    { collection, db, user, languages }: ResolverContextBase
  ): Promise<CreateMutationPayload<PersonDBScheme>> {
    const newInput = {
      ...input,
      professions: mapArrayInputToMultilingual(input.professions || [], languages),
    };
    const person = (await collection('persons').insertOne(newInput)).ops[0];

    await sendNotify('Person', 'persons', db, user, 'create', person);

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
    { db, user, languages }: ResolverContextBase
  ): Promise<UpdateMutationPayload<PersonDBScheme>> {
    const { id, ...rest } = input;
    const newInput = {
      _id: new ObjectId(id),
      ...rest,
      professions: mapArrayInputToMultilingual(input.professions || [], languages),
    } as PersonDBScheme;

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
