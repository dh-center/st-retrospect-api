import Base64URL from 'base64-url';
import { GraphQLScalarType } from 'graphql';
import { ObjectId } from 'mongodb';

/**
 * Encode id to cursor
 * @param value - value to encode
 */
export function toCursor(value: ObjectId): string {
  return Base64URL.encode(value.toString());
}

/**
 * Decode cursor to id
 * @param string - string to decode
 */
export function fromCursor(string: string): ObjectId {
  return new ObjectId(Base64URL.decode(string));
}

const CursorType = new GraphQLScalarType({
  name: 'Cursor',
  serialize(value: ObjectId): string|null {
    if (value) {
      return toCursor(value);
    } else {
      return null;
    }
  },
  parseValue(value): ObjectId {
    return fromCursor(value);
  }
});

export default {
  Cursor: CursorType
};
