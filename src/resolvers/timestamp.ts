import { Kind } from 'graphql/language';
import { GraphQLScalarType } from 'graphql';

const TimestampType = new GraphQLScalarType({
  name: 'Timestamp',
  serialize(date): number|null {
    return (date instanceof Date) ? date.getTime() : null;
  },

  parseValue(date: number): Date|null {
    try {
      return new Date(date);
    } catch (error) {
      return null;
    }
  },

  parseLiteral(ast): Date|null {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    } else if (ast.kind === Kind.STRING) {
      return this.parseValue && this.parseValue(ast.value);
    } else {
      return null;
    }
  },
});

export default {
  Timestamp: TimestampType,
};
