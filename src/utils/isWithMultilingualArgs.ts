import { GraphQLFieldConfig, NamedTypeNode, NonNullTypeNode } from 'graphql';

/**
 * Returns true if there are any multilingual args in field resolver
 *
 * @param fieldConfig - field config to parse
 * @param multilingualInputTypes - object with multilingual types to check
 */
export default function isWithMultilingualArgs(
  fieldConfig: GraphQLFieldConfig<unknown, unknown>,
  multilingualInputTypes: Record<string, string[]>
): boolean {
  const isMultilingualNamedType = (type: NamedTypeNode): boolean => {
    const argTypeName = type.name.value;

    return !!multilingualInputTypes[argTypeName];
  };

  const isMultilingualNonNullType = (type: NonNullTypeNode): boolean => {
    switch (type.type.kind) {
      case 'NamedType':
        return isMultilingualNamedType(type.type);

      /**
       * @todo add support for list types
       */
      case 'ListType':
        return false;
    }
  };

  return !!fieldConfig.astNode?.arguments?.some(arg => {
    switch (arg.type.kind) {
      case 'NamedType': {
        return isMultilingualNamedType(arg.type);
      }

      case 'NonNullType':
        return isMultilingualNonNullType(arg.type);

      /**
       * @todo add support for list types
       */
      case 'ListType':
        return false;
    }
  });
}
