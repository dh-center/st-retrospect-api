import {
  CreateMutationPayload,
  DeleteMutationPayload, NodeName,
  ResolverContextBase,
  UpdateMutationPayload
} from '../types/graphql';
import { ObjectId } from 'mongodb';
import mergeWith from 'lodash.mergewith';
import { toGlobalId } from '../utils/globalId';

const axios = require('axios');

/**
 * @param input
 * @param message
 * @param depth
 */
function messageCreating(input: PersonDBScheme, message: string, depth = 1): string {
  for (const [key, value] of Object.entries(input)) {
    if (!value || value.ru == '' || value.en == '' || key == '_id') {
      continue;
    }
    message += '\t'.repeat(depth * 3) + `<i>${key}</i>\n`;
    if (typeof value == 'object') {
      message = messageCreating(value, message, depth + 1);
    } else {
      message += '\t'.repeat((depth + 1) * 3) + `${encodeURIComponent(value)}\n\n`;
    }
  }

  return message;
}

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

    const newId = toGlobalId('Person', input._id);
    const currentUser = (await db.collection('users').findOne({ _id: new ObjectId(user.id) }));

    const message = `<b>Person:</b>\n`;

    const fullMessage = messageCreating(input, message);

    await axios({
      method: 'post',
      url: process.env.NOTIFY_URL,
      data: 'message=' + '<b>New person! 👶</b>\n' + `Created by <i>${currentUser.username}</i> (${user.id})\n` +
        `See on <a href="${process.env.ADMIN_URL}${newId}">this page</a>\n\n${fullMessage}` + '&parse_mode=HTML',
    });

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

    console.log(input);

    const newId = toGlobalId('Person', id);
    const currentUser = (await db.collection('users').findOne({ _id: new ObjectId(user.id) }));

    let messageNew = `<b>New fields:</b>\n`;
    let haveNew;
    let messageUpdate = `<b>Updated fields:</b>\n`;
    let haveUpdate;

    for (const [key, obj] of Object.entries(input)) {
      if (obj && key != '_id') {
        if (typeof obj == 'object') {
          for (const [lang, value] of Object.entries(obj)) {
            if (value != '') {
              if (originalPerson[key][lang]) {
                messageUpdate += `\t\t\t<i>${key}</i>\n\t\t\t\t\t\t${lang}: ${originalPerson[key][lang]} → ${value}\n\n`;
                haveUpdate = true;
              } else {
                messageNew += `\t\t\t<i>${key}</i>\n\t\t\t\t\t\t${lang}: ${value}\n\n`;
                haveNew = true;
              }
            }
          }
        } else {
          messageUpdate += `\t\t\t<i>${key}</i>\n\t\t\t\t\t\t${originalPerson[key]} → ${obj}\n\n`;
        }
      }
    }

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

    let fullMessage = '';

    if (haveUpdate) {
      fullMessage += messageUpdate;
    }
    if (haveNew) {
      fullMessage += messageNew;
    }

    await axios({
      method: 'post',
      url: process.env.NOTIFY_URL,
      data: 'message=' + '<b>Person has been updated! 👨</b>\n' + `Updated by <i>${currentUser.username}</i> (${user.id})\n` +
        `See on <a href="${process.env.ADMIN_URL}${newId}">this page</a>\n\n` +
        `${fullMessage}` + '&parse_mode=HTML',
    });

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
    { db }: ResolverContextBase
  ): Promise<DeleteMutationPayload> {
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
