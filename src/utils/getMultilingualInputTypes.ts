import { GraphQLSchema } from 'graphql';
import { getDirectives, MapperKind, mapSchema } from '@graphql-tools/utils';

/**
 * Collect all input types with multilingual fields
 *
 * @todo Collect inputs with multilingual subfields
 * @param schema - GraphQL schema to extract multilingual input types
 */
export default function (schema: GraphQLSchema): Record<string, string[]> {
  const multilingualInputTypes:Record<string, string[]> = {};

  mapSchema(schema, {
    [MapperKind.INPUT_OBJECT_TYPE]: (fieldConfig) => {
      Object.values(fieldConfig.getFields()).forEach(field => {
        const isOnType = !!getDirectives(schema, field)['multilingual'];

        if (isOnType) {
          if (multilingualInputTypes[fieldConfig.name]) {
            multilingualInputTypes[fieldConfig.name].push(field.name);
          } else {
            multilingualInputTypes[fieldConfig.name] = [ field.name ];
          }
        }
      });

      return fieldConfig;
    },
  });

  return multilingualInputTypes;
}
