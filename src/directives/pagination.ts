import { GraphQLSchema } from 'graphql';
import { DirectiveTransformer, ResolverContextBase } from '../types/graphql';
import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';
import { applyPagination, Connection, limitQueryWithId, PaginationArguments } from '../pagination';

/**
 * Arguments for PaginationDirective
 */
interface PaginationDirectiveArgs {
  /**
   * Collection with needed data
   */
  collectionName: string;
}

/**
 * Directive for pagination according to the Relay specification
 * (https://relay.dev/graphql/connections.htm)
 *
 * @param directiveName - directive name in graphql schema
 */
export default function paginationDirective(directiveName: string): DirectiveTransformer {
  return (schema: GraphQLSchema): GraphQLSchema => mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directives = getDirectives(schema, fieldConfig);
      const directiveArgumentMap = directives[directiveName];

      if (directiveArgumentMap) {
        const { collectionName }: PaginationDirectiveArgs = directiveArgumentMap;

        fieldConfig.resolve = async (parent, args: PaginationArguments, { db }: ResolverContextBase): Promise<Connection<unknown>> => {
          const query = db.collection(collectionName).find();
          const totalCount = await query.clone().count();

          limitQueryWithId(
            query,
            args.before,
            args.after,
            args.filter
          );
          const pageInfo = await applyPagination(
            query, args.first, args.last
          );
          const list = await query.toArray();
          const edges = list.map((item) => ({
            cursor: item._id,
            node: item,
          }));

          return {
            totalCount,
            edges,
            pageInfo: {
              ...pageInfo,
              startCursor: list.length ? list[0]._id : undefined,
              endCursor: list.length ? list[list.length - 1]._id : undefined,
            },
          };
        };

        return fieldConfig;
      }
    },
  });
}
