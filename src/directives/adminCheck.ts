import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { DirectiveTransformer, ResolverContextBase } from '../types/graphql';
import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';
import { AuthenticationError } from 'apollo-server-express';
import { checkAuth } from './authСheck';

/**
 * Checks admin permission before resolver call
 *
 * @param directiveName - directive name in graphql schema
 */
export default function adminCheckDirective(directiveName: string): DirectiveTransformer {
  return (schema: GraphQLSchema): GraphQLSchema => mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directives = getDirectives(schema, fieldConfig);
      const directiveArgumentMap = directives[directiveName];

      if (directiveArgumentMap) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async (parent, args, context: ResolverContextBase, info): Promise<unknown> => {
          const tokenData = context.tokenData;

          if (checkAuth(tokenData)) {
            if (!tokenData.permissions.some(perm => perm === 'admin')) {
              throw new AuthenticationError(
                'This action is available to administrators only.'
              );
            }
          }

          return resolve(parent, args, context, info);
        };

        return fieldConfig;
      }
    },
  });
}
