import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { DirectiveTransformer, ResolverContextBase } from '../types/graphql';
import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';
import { AuthenticationError } from 'apollo-server-express';
import { ExpiredAccessToken } from '../errorTypes';
import { AccessTokenPayload, AccessTokenError } from '../utils/jwt';


/**
 * Function for checking is user authed or not
 *
 * @param tokenData - data from access token for checking
 */
export function checkAuth(tokenData: AccessTokenPayload | AccessTokenError | null): tokenData is AccessTokenPayload {
  if (!tokenData) {
    throw new AuthenticationError(
      'You must be signed in to have access to this functionality.'
    );
  }

  if ('errorName' in tokenData) {
    throw new ExpiredAccessToken();
  }

  return true;
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
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async (parent, args, context: ResolverContextBase, info): Promise<unknown> => {
          checkAuth(context.tokenData);

          return resolve(parent, args, context, info);
        };

        return fieldConfig;
      }
    },
  });
}
