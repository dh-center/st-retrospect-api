import { Kind, GraphQLError, GraphQLScalarType, ValueNode } from 'graphql';
import { ObjectId } from 'mongodb';

const MONGODB_OBJECT_ID_REGEX = /^[A-Fa-f0-9]{24}$/;

const GraphQLObjectID = new GraphQLScalarType({
  name: 'ObjectId',

  description:
    'A field whose value conforms with the standard mongodb object ID as described here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c',

  serialize(value: ObjectId | string): string {
    value = value.toString();
    if (!MONGODB_OBJECT_ID_REGEX.test(value)) {
      throw new TypeError(
        `Value is not a valid mongodb object id of form: ${value}`
      );
    }

    return value;
  },

  parseValue(value: string): ObjectId {
    if (!MONGODB_OBJECT_ID_REGEX.test(value)) {
      throw new TypeError(
        `Value is not a valid mongodb object id of form: ${value}`
      );
    }

    return new ObjectId(value);
  },

  parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as mongodb object id but got a: ${ast.kind}`
      );
    }

    if (!MONGODB_OBJECT_ID_REGEX.test(ast.value)) {
      throw new TypeError(
        `Value is not a valid mongodb object id of form: ${ast.value}`
      );
    }

    return ast.value;
  },
});

export default GraphQLObjectID;
