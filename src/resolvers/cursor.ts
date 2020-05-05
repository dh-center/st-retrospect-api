import Base64URL from 'base64-url';
import { GraphQLScalarType } from 'graphql';
// import { Kind } from 'graphql/language';
import { ObjectId } from 'mongodb';

/**
 * encode
 * @param value
 */
export function toCursor(value: ObjectId): string {
  return Base64URL.encode(value.toString());
}

/**
 * decode
 * @param string
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
  /*
   * parseLiteral(ast): ObjectId|null {
   *   if (ast.kind === Kind.STRING) {
   *     return fromCursor(ast.value);
   *   } else {
   *     return null;
   *   }
   * },
   */
  parseValue(value): ObjectId {
    return fromCursor(value);
  }
});

export default {
  Cursor: CursorType
};
