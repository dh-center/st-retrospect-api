import { DirectiveTransformer, ResolverContextBase } from '../types/graphql';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { getDirectives, MapperKind, mapSchema } from '@graphql-tools/utils';

interface RenameFieldDirectiveArgs {
  /**
   * Name of the parent's field to extract value
   */
  name: string;
}

/**
 * Checks user authentication before resolver call
 *
 * @param directiveName - directive name in graphql schema
 */
export default function authCheckDirective(directiveName: string): DirectiveTransformer {
  return (schema: GraphQLSchema): GraphQLSchema => mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName) => {
      const directives = getDirectives(schema, fieldConfig);
      const directiveArgumentMap = directives[directiveName];

      if (directiveArgumentMap) {
        const { name }: RenameFieldDirectiveArgs = directiveArgumentMap;
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async (parent, args, context: ResolverContextBase, info): Promise<unknown> => {
          parent[fieldName] = parent[name];
          delete parent[name];

          return resolve(parent, args, context, info);
        };

        return fieldConfig;
      }
    },
  });
}
