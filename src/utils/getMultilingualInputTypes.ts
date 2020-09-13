import {
  GraphQLInputField,
  GraphQLInputObjectType,
  GraphQLSchema,
  InputValueDefinitionNode,
  ListTypeNode, NamedTypeNode, NonNullTypeNode
} from 'graphql';
import { getDirectives, MapperKind, mapSchema } from '@graphql-tools/utils';

/**
 * @param fieldConfig
 */
function getNamedTypeName(fieldConfig: NamedTypeNode): string {
  return fieldConfig.name.value;
}
/**
 * @param fieldConfig
 */
function getNonNullTypeName(fieldConfig: NonNullTypeNode): string {
  switch (fieldConfig.type.kind) {
    case 'NamedType':
      return getNamedTypeName(fieldConfig.type);
    case 'ListType':
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return getListTypeName(fieldConfig.type);
  }
}

/**
 * @param fieldConfig
 */
function getListTypeName(fieldConfig: ListTypeNode): string {
  switch (fieldConfig.type.kind) {
    case 'NonNullType':
      return getNonNullTypeName(fieldConfig.type);

    case 'NamedType':
      return getNamedTypeName(fieldConfig.type);

    case 'ListType':
      return getListTypeName(fieldConfig.type);
  }
}

/**
 * Returns input type name (scalar or object)
 *
 * @param field
 */
function getInputTypeName(field: GraphQLInputField): string {
  switch (field.astNode?.type.kind) {
    case 'ListType':
      return getListTypeName(field.astNode.type);
    case 'NamedType':
      return getNamedTypeName(field.astNode.type);
    case 'NonNullType':
      return getNonNullTypeName(field.astNode.type);
    default:
      return '';
  }
}

/**
 * Checks is provided field multilingual
 *
 * @param schema
 * @param field
 * @param inputTypes
 */
function isFieldMultilingual(schema: GraphQLSchema, field: GraphQLInputField, inputTypes: Record<string, GraphQLInputObjectType>): boolean {
  const isWithDirective = !!getDirectives(schema, field)['multilingual'];

  /**
   * If field with multilingual directive, then it is multilingual
   */
  if (isWithDirective) {
    return true;
  }

  const getTypeName = getInputTypeName(field);
  const inputType = inputTypes[getTypeName];

  if (inputType) {
    return Object.values(inputType.getFields()).some(f => isFieldMultilingual(schema, f, inputTypes));
  }

  return false;
}

/**
 * Collect all input types with multilingual fields
 *
 * @todo Collect inputs with multilingual subfields
 * @param schema - GraphQL schema to extract multilingual input types
 */
export default function getMultilingualInputTypes(schema: GraphQLSchema): Record<string, string[]> {
  const multilingualInputTypes:Record<string, string[]> = {};
  const inputTypesWithConfig: Record<string, GraphQLInputObjectType> = {};

  /**
   * Collect all input types with its configs
   */
  mapSchema(schema, {
    [MapperKind.INPUT_OBJECT_TYPE]: (fieldConfig) => {
      inputTypesWithConfig[fieldConfig.name] = fieldConfig;

      return fieldConfig;
    },
  });

  Object.values(inputTypesWithConfig).map((fieldConfig) => {
    Object.values(fieldConfig.getFields()).forEach(field => {
      const isOnType = isFieldMultilingual(schema, field, inputTypesWithConfig);

      if (isOnType) {
        if (multilingualInputTypes[fieldConfig.name]) {
          multilingualInputTypes[fieldConfig.name].push(field.name);
        } else {
          multilingualInputTypes[fieldConfig.name] = [ field.name ];
        }
      }
    });
  });

  return multilingualInputTypes;
}
