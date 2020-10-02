import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { MapperKind, mapSchema } from '@graphql-tools/utils';
import { ResolverContextBase } from './types/graphql';
import { toGlobalId } from './utils/globalId';

/**
 * Auto-encode all id fields of any type that implements 'Node' interface
 *
 * @param schema - schema to transform
 */
export default function (schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (fieldConfig) => {
      const typeName = fieldConfig.astNode?.name.value;

      if (!typeName) {
        return fieldConfig;
      }

      const isImplementingNode = fieldConfig.getInterfaces().findIndex(i => i.name === 'Node') !== -1;

      if (!isImplementingNode) {
        return fieldConfig;
      }

      const field = fieldConfig.getFields()['id'];

      const { resolve = defaultFieldResolver } = field;

      field.resolve = async (parent, args, context: ResolverContextBase, info): Promise<unknown> => {
        const value = resolve(parent, args, context, info);

        return toGlobalId(typeName, value);
      };

      return fieldConfig;
    },
  });
}
