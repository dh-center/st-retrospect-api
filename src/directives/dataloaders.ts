import { DirectiveTransformer, ResolverContextBase } from '../types/graphql';
import { FieldsWithDataLoader } from '../dataLoaders';
import { ObjectId } from 'mongodb';
import { GraphQLSchema } from 'graphql';

import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';

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
}

/**
 * Checks user authentication before resolver call
 *
 * @param directiveName - directive name in graphql schema
 */
export default function authCheckDirective(directiveName: string): DirectiveTransformer {
  return (schema: GraphQLSchema): GraphQLSchema => mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directives = getDirectives(schema, fieldConfig);
      const directiveArgumentMap = directives[directiveName];

      if (directiveArgumentMap) {
        const { dataLoaderName, fieldName }: DataLoaderDirectiveArgs = directiveArgumentMap;

        fieldConfig.resolve = async (parent, args, context: ResolverContextBase): Promise<unknown> => {
          const fieldValue = parent[fieldName];

          if (fieldValue instanceof Array) {
            if (!fieldValue) {
              return [];
            }

            return context.dataLoaders[dataLoaderName].loadMany(
              (fieldValue.filter(Boolean) as ObjectId[])
                .map(id => id.toString()).filter(Boolean)
            );
          } else {
            if (!fieldValue) {
              return null;
            }

            const value = await context.dataLoaders[dataLoaderName].load(fieldValue.toString());

            if (!value) {
              return null;
            }

            return value;
          }
        };

        return fieldConfig;
      }
    },
  });
}
