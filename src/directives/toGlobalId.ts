import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { DirectiveTransformer, NodeName, ResolverContextBase } from '../types/graphql';
import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';
import { toGlobalId } from '../utils/globalId';

interface ToGlobalIdDirectiveArgs {
  type: NodeName;
}

/**
 * Converts MongoDB Object ID value to global id
 *
 * @param directiveName - directive name in graphql schema
 */
export default function toGlobalIdDirective(directiveName: string): DirectiveTransformer {
  return (schema: GraphQLSchema): GraphQLSchema => mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directives = getDirectives(schema, fieldConfig);
      const directiveArgumentMap = directives[directiveName];

      if (directiveArgumentMap) {
        const { type }: ToGlobalIdDirectiveArgs = directiveArgumentMap;

        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async (parent, args, context: ResolverContextBase, info): Promise<unknown> => {
          const value = resolve(parent, args, context, info);

          return toGlobalId(type, value);
        };

        return fieldConfig;
      }
    },
  });
}
