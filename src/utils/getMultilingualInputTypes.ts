import {
  GraphQLInputField,
  GraphQLInputObjectType,
  GraphQLSchema,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode
} from 'graphql';
import { getDirectives, MapperKind, mapSchema } from '@graphql-tools/utils';

export type MultilingualInputTypesWithFields = Record<string, string[]>;
export type MultilingualInputTypesWithConfig = Record<string, GraphQLInputObjectType>;

/**
 * Returns type name of names field
 *
 * @param fieldConfig - field to parse
 */
function getNamedTypeName(fieldConfig: NamedTypeNode): string {
  return fieldConfig.name.value;
}

/**
 * Returns type name of non-null field
 *
 * @param fieldConfig - field to parse
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
 * Returns type name of list-type field
 *
 * @param fieldConfig - field to parse
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
 * @param field - field to parse
 */
export function getInputTypeName(field: GraphQLInputField): string {
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
 * @param schema - GraphQL schema to parse
 * @param field - field to parse
 * @param inputTypes - input types map of this schema
 */
function isFieldMultilingual(schema: GraphQLSchema, field: GraphQLInputField, inputTypes: Record<string, GraphQLInputObjectType>): boolean {
  const isWithDirective = !!getDirectives(schema, field)['multilingual'];

  /**
   * If field with multilingual directive, then it is multilingual
   */
  if (isWithDirective) {
    return true;
  }

  /**
   * Get type name and if it is multilingual then return true
   */
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
 * @param schema - GraphQL schema to extract multilingual input types
 */
export default function getMultilingualInputTypes(schema: GraphQLSchema): [MultilingualInputTypesWithFields, MultilingualInputTypesWithConfig] {
  const multilingualInputTypes: MultilingualInputTypesWithFields = {};
  const inputTypesWithConfig: MultilingualInputTypesWithConfig = {};

  /**
   * Collect all input types with its configs
   */
  mapSchema(schema, {
    [MapperKind.INPUT_OBJECT_TYPE]: (fieldConfig) => {
      inputTypesWithConfig[fieldConfig.name] = fieldConfig;

      return fieldConfig;
    },
  });

  Object.values(inputTypesWithConfig).forEach((fieldConfig) => {
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

  return [multilingualInputTypes, inputTypesWithConfig];
}
