import {
  CreateMutationPayload,
  DeleteMutationPayload,
  Multilingual,
  MultilingualString,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { ObjectId } from 'mongodb';
import sendNotify from '../utils/telegramNotify';
import { CreatePersonInput, UpdatePersonInput } from '../generated/graphql';
import mergeWithCustomizer from '../utils/mergeWithCustomizer';

/**
 * Part of the person with professions
 *
 * @todo remove when @multilingual directive can generate multilingual fields
 */
interface WithProfessions {
  /**
   * Person's professions
   */
  professions?: Multilingual<string[]>
}

/**
 * Person representation in DataBase
 */
export interface PersonDBScheme extends WithProfessions {
  /**
   * Person id
   */
  _id: ObjectId;

  /**
   * Person's last name
   */
  lastName?: MultilingualString | null;

  /**
   * Person's first name
   */
  firstName?: MultilingualString | null;

  /**
   * Person's patronymic
   */
  patronymic?: MultilingualString | null;

  /**
   * Person's pseudonym
   */
  pseudonym?: MultilingualString | null;

  /**
   * Person's description
   */
  description?: MultilingualString | null;

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
    { input }: { input: CreatePersonInput & WithProfessions },
    { collection, db, tokenData }: ResolverContextBase<true>
  ): Promise<CreateMutationPayload<PersonDBScheme>> {
    const newInput = {
      ...input,
    };

    const person = (await collection('persons').insertOne(newInput)).ops[0];

    await sendNotify('Person', 'persons', db, tokenData, 'create', person);

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
    { input }: { input: UpdatePersonInput & WithProfessions },
    { db, tokenData }: ResolverContextBase<true>
  ): Promise<UpdateMutationPayload<PersonDBScheme>> {
    const { id, ...rest } = input;
    const newInput = {
      _id: new ObjectId(id),
      ...rest,
    } as PersonDBScheme;

    const originalPerson = await db.collection('persons').findOne({
      _id: newInput._id,
    });

    await sendNotify('Person', 'persons', db, tokenData, 'update', newInput, 'persons');

    const person = await db.collection('persons').findOneAndUpdate(
      { _id: newInput._id },
      {
        $set: mergeWithCustomizer(originalPerson, newInput),
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
    { db, tokenData }: ResolverContextBase<true>
  ): Promise<DeleteMutationPayload> {
    const originalPerson = await db.collection('persons').findOne({
      _id: id,
    });

    await sendNotify('Person', 'persons', db, tokenData, 'delete', originalPerson);

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
