import { DirectiveTransformer, ResolverContextBase } from '../types/graphql';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';

/**
 * Arguments for authCheck directive
 */
interface FromFieldDirectiveArgs {
  /**
   * Name of the parent's field to extract value
   */
  name: string;
}

/**
 * Extracts value from specified field in parent object
 *
 * @param directiveName - directive name in graphql schema
 */
export default function fromFieldDirective(directiveName: string): DirectiveTransformer {
  return (schema: GraphQLSchema): GraphQLSchema => mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName) => {
      const directives = getDirectives(schema, fieldConfig);
      const directiveArgumentMap = directives[directiveName];

      if (directiveArgumentMap) {
        const { name }: FromFieldDirectiveArgs = directiveArgumentMap;
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async (parent, args, context: ResolverContextBase, info): Promise<unknown> => {
          parent[fieldName] = parent[name];

          return resolve(parent, args, context, info);
        };

        return fieldConfig;
      }
    },
  });
}
