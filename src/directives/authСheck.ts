import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { DirectiveTransformer, ResolverContextBase } from '../types/graphql';
import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';
import { AuthenticationError } from 'apollo-server-express';

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
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async (parent, args, context: ResolverContextBase, info): Promise<unknown> => {
          if (!context.user.id) {
            throw new AuthenticationError(
              'You must be signed in to have access to this functionality.'
            );
          }

          return resolve(parent, args, context, info);
        };

        return fieldConfig;
      }
    },
  });
}
