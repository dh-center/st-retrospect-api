import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver, GraphQLField } from 'graphql';

/**
 * Directive for renaming type fields
 */
export default class RenameFieldDirective extends SchemaDirectiveVisitor {
  /**
   * Method to be called on field visit
   * @param field - GraphQL field definition
   */
  visitFieldDefinition(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: GraphQLField<any, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): GraphQLField<any, any> | void | null {
    const { name } = this.args;
    const { resolve = defaultFieldResolver } = field;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field.resolve = async (object, args, context, info): Promise<any> => {
      object[field.name] = object[name];
      return resolve.call(this, object, args, context, info);
    };
  }
}
