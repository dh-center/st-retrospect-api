import { SchemaDirectiveVisitor } from 'graphql-tools';
import { GraphQLField } from 'graphql';
import { ResolverContextBase } from '../types/graphql';
import { applyPagination, limitQueryWithId, PaginationArguments } from '../pagination';

/**
 * Arguments for PaginationDirective
 */
interface PaginationDirectiveArgs {
  /**
   * Table with needed data
   */
  collectionName: string;
}

/**
 * Directive for pagination according to the Relay specification
 * (https://relay.dev/graphql/connections.htm)
 */
export default class PaginationDirective extends SchemaDirectiveVisitor {
  /**
   * @param field - GraphQL field definition
   */
  visitFieldDefinition(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: GraphQLField<any, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): GraphQLField<any, any> | void | null {
    const { collectionName } = this.args as PaginationDirectiveArgs;

    field.resolve = async (parent, args: PaginationArguments, { db }: ResolverContextBase): Promise<any> => {
      const query = db.collection(collectionName).find();
      const totalCount = await query.clone().count();

      limitQueryWithId(
        query,
        args.before,
        args.after
      );
      const pageInfo = await applyPagination(
        query, args.first, args.last
      );
      const list = await query.toArray();
      const edges = list.map((item) => ({
        cursor: item._id,
        node: item
      }));

      return {
        totalCount,
        edges,
        pageInfo: {
          ...pageInfo,
          startCursor: list.length ? list[0]._id : undefined,
          endCursor: list.length ? list[list.length - 1]._id : undefined
        }
      };
    };
  }
}
