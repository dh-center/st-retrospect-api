import { SchemaDirectiveVisitor } from 'graphql-tools';
import { GraphQLField } from 'graphql';
import { ResolverContextBase } from '../types/graphql';
import { FieldsWithDataLoader } from '../dataLoaders';

/**
 * Directive for data loaders
 */
export default class DataLoaderDirective extends SchemaDirectiveVisitor {
  /**
   * @param field - GraphQL field definition
   */
  visitFieldDefinition(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: GraphQLField<any, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): GraphQLField<any, any> | void | null {
    const { dataLoaderName, fieldName } = this.args as { dataLoaderName: FieldsWithDataLoader; fieldName: string };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field.resolve = async (parent, args, context: ResolverContextBase): Promise<any> => {
      if (!parent[fieldName]) {
        return null;
      }

      const value = await context.dataLoaders[dataLoaderName].load(parent[fieldName].toString());

      if (!value) {
        return null;
      }

      return value;
    };
  }
}
