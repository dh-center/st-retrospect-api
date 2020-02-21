import { SchemaDirectiveVisitor } from 'graphql-tools';
import { GraphQLField } from 'graphql';
import { ResolverContextBase } from '../types/graphql';
import { FieldsWithDataLoader } from '../dataLoaders';
import { ObjectId } from 'mongodb';
import { LocationTypeDBScheme } from '../resolvers/locations';

/**
 * Arguments for DataLoaderDirective
 */
interface DataLoaderDirectiveArgs {
  /**
   * Name of needed DataLoader
   */
  dataLoaderName: FieldsWithDataLoader;

  /**
   * Name of field with data for DataLoader
   */
  fieldName: string;

  /**
   * Flag for choosing between 'load' and 'loadMany' (when true)
   */
  flag: boolean;
}

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
    const { dataLoaderName, fieldName, flag } = this.args as DataLoaderDirectiveArgs;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field.resolve = async (parent, args, context: ResolverContextBase): Promise<any> => {
      if (flag) {
        if (!parent[fieldName]) {
          return [];
        }

        const value = await context.dataLoaders[dataLoaderName].loadMany(
          (parent[fieldName].filter(Boolean) as ObjectId[])
            .map(id => id.toString()).filter(Boolean)
        );

        return value;
      } else {
        if (!parent[fieldName]) {
          return null;
        }

        const value = await context.dataLoaders[dataLoaderName].load(parent[fieldName].toString());

        if (!value) {
          return null;
        }

        return value;
      }
    };
  }
}
