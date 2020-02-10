import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver, GraphQLField } from 'graphql';
import { type } from 'os';
import { ResolverContextBase } from '../types/graphql';

/**
 * Directive to filter the language
 */
export default class Multilingual extends SchemaDirectiveVisitor {
  /**
   * @param field - GraphQL field definition
   */
  visitFieldDefinition(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: GraphQLField<any, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): GraphQLField<any, any> | void | null {
    const { resolve = defaultFieldResolver } = field;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field.resolve = async (object, args, context: ResolverContextBase, info): Promise<any> => {
      const value = resolve.call(this, object, args, context, info);

      if (value instanceof Array) {
        return value.map(arrayValue => arrayValue[context.languages[0].toLowerCase()]);
      }
      return value[context.languages[0].toLowerCase()];
    };
  }
}
