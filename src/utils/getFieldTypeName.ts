import { TypeNode } from 'graphql/language/ast';

/**
 * Returns type name of the provided GraphQL AST value
 *
 * @param astType - type to parse
 */
export default function getFieldTypeName(astType: TypeNode): string {
  switch (astType.kind) {
    case 'ListType':
      return getFieldTypeName(astType.type);
    case 'NamedType':
      return astType.name.value;
    case 'NonNullType':
      return getFieldTypeName(astType.type);
  }
}
