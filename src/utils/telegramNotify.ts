/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccessTokenData, MultilingualString, NodeName } from '../types/graphql';
import { toGlobalId } from './globalId';
import { Db, ObjectId } from 'mongodb';
import axios from 'axios';
import { UserDBScheme } from '../resolvers/users';

type ComplexType = Record<string, unknown> | unknown[];
type SimpleType = string | number | boolean;

/**
 * Makes tabulation with necessary level
 *
 * @param level - tabulation level
 */
function tab(level: number): string {
  return '\t'.repeat((level + 1) * 3);
}

/**
 * Function that turns provided value to string
 *
 * @param input - input object
 * @param message - message to send
 * @param depth - the depth at which the function is called
 */
function stringifyValue(input: ComplexType, message: string, depth = 1): string {
  for (const [key, value] of Object.entries(input)) {
    if (
      !value ||
      (typeof value === 'object' && ((value as MultilingualString).ru == '' || (value as MultilingualString).en == '')) ||
      key == '_id') {
      continue;
    }
    message += tab(depth - 1) + `<i>${key}</i>\n`;
    if (typeof value == 'object' && !(value instanceof ObjectId)) {
      message = stringifyValue(value as ComplexType, message, depth + 1);
    } else {
      message += tab(depth) + `${encodeURIComponent(value as SimpleType)}\n\n`;
    }
  }

  return message;
}

/**
 * Checks is value non-empty object
 *
 * @param value - value to check
 */
function isNotEmptyObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && !(value instanceof ObjectId) && value !== null && !Array.isArray(value);
}

/**
 * Function that constructs messages on updating some node
 *
 *
 * @param input - input object
 * @param original - original object from DB
 * @param updatedFields - part of the message with updated fields
 * @param newFields - part of the message with new fields
 * @param deletedFields - part of the message with deleted fields
 * @param fields - list of fields from higher levels
 * @param depth - the depth at which the function is called
 */
function constructUpdateMessage(
  input: ComplexType,
  original: ComplexType,
  updatedFields: string,
  newFields: string,
  deletedFields: string,
  fields: string[],
  depth = 1
): [string, string, string] {
  for (const [key, inputValue] of Object.entries(input)) {
    const originalValue = original && (Array.isArray(original) ? original[+key] : original[key]);

    // Continue when '_id' field or input value matches the original value (including the situation with two empty arrays)
    const needContinue = key === '_id' || inputValue === originalValue;

    if (needContinue) {
      continue;
    }

    // Recursion when value - object, but not ObjectId, null or empty array
    const needRecursion = isNotEmptyObject(inputValue) && !Array.isArray(inputValue);

    if (needRecursion) {
      fields.push(key);
      [updatedFields, newFields, deletedFields] = constructUpdateMessage(
        inputValue as ComplexType,
        originalValue as ComplexType,
        updatedFields,
        newFields,
        deletedFields,
        fields,
        depth + 1
      );
      fields = [];
      continue;
    }

    // Original value is not equal to empty string or empty array
    const originalValueNotEmpty = !!original && (Array.isArray(originalValue) ? originalValue.length : originalValue);
    const encodedOriginalValue = Array.isArray(originalValue) ? JSON.stringify(originalValue) : encodeURIComponent(originalValue as SimpleType);
    const encodedInputValue = Array.isArray(inputValue) ? JSON.stringify(originalValue) : encodeURIComponent(inputValue as SimpleType);

    if (inputValue) {
      if (originalValueNotEmpty) {
        updatedFields += fields.reduce((acc, field, i) => acc + tab(i) + `<i>${field}</i>\n`, '');

        updatedFields += tab(fields.length) + `<i>${key}</i>\n` + tab(fields.length + 1) + `${encodedOriginalValue} → ${encodedInputValue}\n\n`;
      } else {
        newFields += fields.reduce((acc, field, i) => acc + tab(i) + `<i>${field}</i>\n`, '');

        newFields += tab(fields.length) + `<i>${key}</i>\n` + tab(fields.length + 1) + `${encodedInputValue}\n\n`;
      }
    } else {
      deletedFields += fields.reduce((acc, field, i) => acc + tab(i) + `<i>${field}</i>\n`, '');
      deletedFields += tab(fields.length) + `<i>${key}</i>\n`;

      if (isNotEmptyObject(originalValue)) {
        deletedFields = stringifyValue(originalValue, deletedFields, fields.length + 2);
      } else {
        deletedFields += tab(fields.length) + `${encodedOriginalValue}\n\n`;
      }
    }
  }

  return [updatedFields, newFields, deletedFields];
}

/**
 * Function that concat messages from constructUpdateMessage in one message
 *
 * @param input - input object
 * @param original - original object from DB
 * @param message - message to send
 */
function generateUpdateMessage(
  input: Record<string, unknown>,
  original: Record<string, unknown>,
  message: string
): string {
  const messagesArr = [`<b>Updated fields:</b>\n`, `<b>New fields:</b>\n`, `<b>Deleted fields:</b>\n`];

  const fullMessagesArr = constructUpdateMessage(input, original, '', '', '', []);

  for (let i = 0; i < 3; i++) {
    if (fullMessagesArr[i]) {
      message += messagesArr[i] + fullMessagesArr[i];
    }
  }

  return message;
}

/**
 * Function that send message
 *
 * @param message - full message to send
 */
async function sendMessage(message: string): Promise<void> {
  if (!process.env.NOTIFY_URL) {
    return;
  }
  await axios({
    method: 'post',
    url: process.env.NOTIFY_URL,
    data: 'message=' + message + '&parse_mode=HTML',
  });
}

/**
 * Function for sending notification about changes in DB
 * Variant for creating and deleting
 *
 * @param nodeName - name of new/updated/deleted node
 * @param nodeLink - part of link according node
 * @param db - MongoDB connection to make queries
 * @param user - User's access token
 * @param actionType - type of action (create/update/delete)
 * @param input - input object
 * @param collectionName - collection name to make queries
 */
async function sendNotify<T extends {_id: ObjectId}>(
  nodeName: NodeName,
  nodeLink: string,
  db: Db,
  user: AccessTokenData,
  actionType: 'create' | 'delete',
  input: T,
): Promise<void>;

/**
 * Function for sending notification about changes in DB
 * Variant for updating with collection name
 *
 * @param nodeName - name of new/updated/deleted node
 * @param nodeLink - part of link according node
 * @param db - MongoDB connection to make queries
 * @param user - User's access token
 * @param actionType - type of action (create/update/delete)
 * @param input - input object
 * @param collectionName - collection name to make queries
 */
async function sendNotify<T extends {_id: ObjectId}>(
  nodeName: NodeName,
  nodeLink: string,
  db: Db,
  user: AccessTokenData,
  actionType: 'update',
  input: T,
  collectionName: string
): Promise<void>;

/**
 * Function that calls the desired message constructor
 *
 * @param nodeName - name of new/updated/deleted node
 * @param nodeLink - part of link according node
 * @param db - MongoDB connection to make queries
 * @param user - User's access token
 * @param actionType - type of action (create/update/delete)
 * @param input - input object
 * @param collectionName - collection name to make queries
 */
async function sendNotify<T extends {_id: ObjectId}>(
  nodeName: NodeName,
  nodeLink: string,
  db: Db,
  user: AccessTokenData,
  actionType: 'create' | 'delete' | 'update',
  input: T,
  collectionName?: string
): Promise<void> {
  const globalId = toGlobalId(nodeName, input._id);

  const currentUser = (await db.collection('users').findOne({ _id: new ObjectId(user.id) })) as UserDBScheme;

  let fullMessage: string;

  switch (actionType) {
    case 'create': {
      const message = `<b>New ${nodeName.toLowerCase()}! 🆕</b>\nCreated by <i>${currentUser.username}</i> (${user.id})\n` +
        `See on <a href="${process.env.ADMIN_URL}/${nodeLink}/${globalId}">this page</a>\n\n<b>${nodeName}:</b>\n`;

      try {
        fullMessage = stringifyValue(input, message);
      } catch {
        fullMessage = message + `Can't print changes due to error`;
      }
      break;
    }

    case 'update': {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const original = await db.collection(collectionName!).findOne({
        _id: input._id,
      });
      const message = `<b>${nodeName} has been updated! 🆙</b>\nUpdated by <i>${currentUser.username}</i> (${user.id})\n` +
        `See on <a href="${process.env.ADMIN_URL}/${nodeLink}/${globalId}">this page</a>\n\n`;

      try {
        fullMessage = generateUpdateMessage(input, original, message);
      } catch {
        fullMessage = message + `Can't print changes due to error`;
      }
      break;
    }

    case 'delete': {
      const message = `<b>${nodeName} deleted! 🚮</b>\nDeleted by <i>${currentUser.username}</i> (${user.id})\n` +
        `See on <a href="${process.env.ADMIN_URL}/${nodeLink}/${globalId}">this page</a>\n\n<b>${nodeName}:</b>\n` +
        '\t'.repeat(3) + `<i>_id</i>\n` + '\t'.repeat(6) + `${input._id}\n\n`;

      try {
        fullMessage = stringifyValue(input, message);
      } catch {
        fullMessage = message + `Can't print changes due to error`;
      }
      fullMessage = stringifyValue(input, message);
    }
  }

  await sendMessage(fullMessage);
}

export default sendNotify;
