import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver, GraphQLField } from 'graphql';
import { AuthenticationError } from 'apollo-server-express';

/**
 * Directive for checking user authorization
 */
export default class AuthCheckDirective extends SchemaDirectiveVisitor {
  /**
   * @param field - GraphQL field definition
   */
  visitFieldDefinition(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: GraphQLField<any, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): GraphQLField<any, any> | void | null {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async (parent, args, context, info): Promise<any> => {
      if (!context.user.id) {
        throw new AuthenticationError(
          'You must be signed in to have access to this functionality.'
        );
      }

      return resolve.call(this, parent, args, context, info);
    };
  }
}
