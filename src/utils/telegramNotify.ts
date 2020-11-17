import { AccessTokenData, NodeName } from '../types/graphql';
import { toGlobalId } from './globalId';
import { Db, ObjectId } from 'mongodb';
import axios from 'axios';

/**
 * @param input - input object
 * @param message - message to send
 * @param depth - the depth at which the function is called
 */
function messageCreating(input: Record<string, string | any>, message: string, depth = 1): string {
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

/**
 * @param input - input object
 * @param original - original object from DB
 * @param updatedFields - part of the message with updated fields
 * @param newFields - part of the message with new fields
 * @param deletedFields - part of the message with deleted fields
 * @param fields - list of fields from higher levels
 * @param depth - the depth at which the function is called
 */
function messageUpdatingConstructor(
  input: Record<string, string | any>,
  original: Record<string, string | any>,
  updatedFields: string,
  newFields: string,
  deletedFields: string,
  fields: string[],
  depth = 1
): [string, string, string] {
  for (const [key, value] of Object.entries(input)) {
    if (depth == 1) {
      fields = [];
    }
    if (key == '_id') {
      continue;
    }
    if (typeof value == 'object' && !Array.isArray(value)) {
      fields.push(key);
      [updatedFields, newFields, deletedFields] = messageUpdatingConstructor(value, original[key], updatedFields, newFields, deletedFields, fields, depth + 1);
    } else {
      if ((!Array.isArray(value) && value != '') || (Array.isArray(value) && value.length)) {
        if ((!Array.isArray(original[key]) && original[key]) || (Array.isArray(original[key]) && original[key].length)) {
          for (let i = 0; i < fields.length; i++) {
            updatedFields += '\t'.repeat((i + 1) * 3) + `<i>${fields[i]}</i>\n`;
          }
          updatedFields += '\t'.repeat((fields.length + 1) * 3) + `<i>${key}</i>\n` + '\t'.repeat((fields.length + 2) * 3) + `${encodeURIComponent(original[key])} → ${encodeURIComponent(value)}\n\n`;
        } else {
          for (let i = 0; i < fields.length; i++) {
            newFields += '\t'.repeat((i + 1) * 3) + `<i>${fields[i]}</i>\n`;
          }
          newFields += '\t'.repeat((fields.length + 1) * 3) + `<i>${key}</i>\n`;
          if (Array.isArray(value)) {
            newFields = messageCreating(value, deletedFields, fields.length + 2);
          } else {
            newFields += '\t'.repeat((fields.length + 2) * 3) + `${encodeURIComponent(value)}\n\n`;
          }
        }
      } else {
        for (let i = 0; i < fields.length; i++) {
          deletedFields += '\t'.repeat((i + 1) * 3) + `<i>${fields[i]}</i>\n`;
        }
        deletedFields += '\t'.repeat((fields.length + 1) * 3) + `<i>${key}</i>\n`;
        if (typeof original[key] == 'object' && !Array.isArray(original[key])) {
          deletedFields = messageCreating(original[key], deletedFields, fields.length + 2);
        } else {
          deletedFields += '\t'.repeat((fields.length + 2) * 3) + `${encodeURIComponent(original[key])}\n\n`;
        }
      }
    }
  }

  return [updatedFields, newFields, deletedFields];
}

/**
 * @param input - input object
 * @param original - original object from DB
 * @param message - message to send
 */
function messageUpdating(
  input: Record<string, string | any>,
  original: Record<string, string | any>,
  message: string
): string {
  const messagesArr = [`<b>Updated fields:</b>\n`, `<b>New fields:</b>\n`, `<b>Deleted fields:</b>\n`];

  const fullMessagesArr = messageUpdatingConstructor(input, original, '', '', '', []);

  for (let i = 0; i < 3; i++) {
    if (fullMessagesArr[i]) {
      message += messagesArr[i] + fullMessagesArr[i];
    }
  }

  return message;
}

/**
 * @param message - full message to send
 */
async function sending(message: string): Promise<void> {
  await axios({
    method: 'post',
    url: process.env.NOTIFY_URL,
    data: 'message=' + message + '&parse_mode=HTML',
  });
}

/**
 * @param nodeName - name of new/updated/deleted node
 * @param nodeLink - part of link according node
 * @param db - MongoDB connection to make queries
 * @param user - User's access token
 * @param actionType - type of action (create/update/delete)
 * @param input - input object
 * @param collection - collection name to make queries
 */
export default async function sendNotify(
  nodeName: NodeName,
  nodeLink: string,
  db: Db,
  user: AccessTokenData,
  actionType: string,
  input: Record<string, string | any>,
  collection?: string
): Promise<void> {
  const newId = toGlobalId(nodeName, input._id);
  const currentUser = (await db.collection('users').findOne({ _id: new ObjectId(user.id) }));

  if (actionType == 'create') {
    const message = `<b>New ${nodeName.toLowerCase()}! 🆕</b>\nCreated by <i>${currentUser.username}</i> (${user.id})\n` +
        `See on <a href="${process.env.ADMIN_URL}/${nodeLink}/${newId}">this page</a>\n\n<b>${nodeName}:</b>\n`;
    const fullMessage = messageCreating(input, message);

    await sending(fullMessage);
  } else if (actionType == 'update' && collection) {
    const original = await db.collection(collection).findOne({
      _id: input._id,
    });
    const message = `<b>${nodeName} has been updated! 🆙</b>\nUpdated by <i>${currentUser.username}</i> (${user.id})\n` +
        `See on <a href="${process.env.ADMIN_URL}/${nodeLink}/${newId}">this page</a>\n\n`;
    const fullMessage = messageUpdating(input, original, message);

    await sending(fullMessage);
  } else if (actionType == 'delete') {
    const message = `<b>${nodeName} deleted! 🚮</b>\nDeleted by <i>${currentUser.username}</i> (${user.id})\n` +
      `See on <a href="${process.env.ADMIN_URL}/${nodeLink}/${newId}">this page</a>\n\n<b>${nodeName}:</b>\n` +
      '\t'.repeat(3) + `<i>_id</i>\n` + '\t'.repeat(6) + `${input._id}\n\n`;
    const fullMessage = messageCreating(input, message);

    await sending(fullMessage);
  }
}
