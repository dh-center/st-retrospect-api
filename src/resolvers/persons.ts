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
import { CreatePersonInput, PersonMutationsDeleteArgs, UpdatePersonInput } from '../generated/graphql';
import mergeWithCustomizer from '../utils/mergeWithCustomizer';
import { UserInputError } from 'apollo-server-express';

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

  /**
   * Person tag ids
   */
  tagIds?: ObjectId[];

  /**
   * Person's main photo
   */
  mainPhotoLink?: string | null;

  /**
   * Person's photos links
   */
  photoLinks?: string[] | null;

  /**
   * Link with photo for card
   */
  cardPhotoLink?: string | null;
}

const Query = {
  /**
   * Returns all persons cards
   *
   * @param parent - the object that contains the result returned from the resolver on the parent field
   * @param args - query args object
   * @param context - query context
   */
  async personsCards(parent: undefined, args: undefined, { collection, dataLoaders }: ResolverContextBase): Promise<PersonDBScheme[]> {
    const [ { personsCardsIds } ] = await collection('quests')
      .aggregate([
        {
          '$unwind': {
            'path': '$personsCardsIds',
          },
        },
        {
          '$group': {
            '_id': null,
            'personsCardsIds': {
              '$push': '$personsCardsIds',
            },
          },
        },
      ])
      .toArray();

    if (!personsCardsIds) {
      return [];
    }

    const result = await dataLoaders
      .personById
      .loadMany(personsCardsIds.map(id => id.toString()));

    return result.filter((person): person is PersonDBScheme => !!person);
  },
};

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
    { id }: PersonMutationsDeleteArgs,
    { db, collection, tokenData }: ResolverContextBase<true>
  ): Promise<DeleteMutationPayload> {
    const person = await collection('persons').findOne({
      _id: id,
    });

    if (!person) {
      throw new UserInputError('There is no person with such id: ' + id);
    }

    await sendNotify('Person', 'persons', db, tokenData, 'delete', person);

    await collection('persons').deleteOne({ _id: id });

    await collection('relations').deleteMany({
      personId: id,
    });

    await collection('quests').updateMany({
      personsCardsIds: id,
    },
    {
      $pull: {
        personsCardsIds: id,
      },
    });

    return {
      recordId: new ObjectId(id),
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
