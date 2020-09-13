import {
  defaultFieldResolver,
  GraphQLSchema,
  InputValueDefinitionNode,
  NamedTypeNode,
  NonNullTypeNode
} from 'graphql';
import { getDirectives, MapperKind, mapSchema } from '@graphql-tools/utils';
import { DirectiveTransformer, ResolverContextBase } from '../types/graphql';
import getMultilingualInputTypes from '../utils/getMultilingualInputTypes';
import isWithMultilingualArgs from '../utils/isWithMultilingualArgs';

/**
 * Directive for multilingual fields support
 *
 * On input field maps provided value to multilingual object (e.g. 'hello' => {en: 'hello'})
 * On type field maps multilingual object to value ({en: 'hello'} => 'hello')
 *
 * @param directiveName - directive name in GraphQL schema
 */
export default function multilingualDirective(directiveName: string): DirectiveTransformer {
  return (schema: GraphQLSchema): GraphQLSchema => {
    const multilingualInputTypes = getMultilingualInputTypes(schema);

    const mapArgs = (args: {[key: string]: unknown}, argsAst: readonly InputValueDefinitionNode[], language: string): void => {
      const mapMultilingualFields = (fields: {[key: string]: unknown}, fieldNamesToMap: string[]): void => {
        fieldNamesToMap.forEach((fieldNameToMap) => {
          if (fields[fieldNameToMap]) {
            fields[fieldNameToMap] = {
              [language.toLowerCase()]: fields[fieldNameToMap],
            };
          }
        });
      };

      const mapNamedType = (arg: unknown, type: NamedTypeNode): void => {
        if (type.name.value in multilingualInputTypes) {
          mapMultilingualFields(arg as {[key: string]: unknown}, multilingualInputTypes[type.name.value]);
        }
      };

      const mapNonNullType = (arg: unknown, type: NonNullTypeNode): void => {
        switch (type.type.kind) {
          case 'NamedType':
            return mapNamedType(arg, type.type);

          /**
           * @todo add support for list types
           */
          case 'ListType':
        }
      };

      argsAst.forEach((argAst: InputValueDefinitionNode) => {
        switch (argAst.type.kind) {
          case 'NamedType':
            return mapNamedType(args[argAst.name.value], argAst.type);
          case 'NonNullType':
            return mapNonNullType(args[argAst.name.value], argAst.type);
        }
      });
    };

    return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const directives = getDirectives(schema, fieldConfig);

        /**
         * Map with directive args. If undefined then directive is not applied here
         */
        const directiveArgumentMap = directives[directiveName];

        /**
         * Is that field contains multilingual args
         */
        const withMultilingualArgs = isWithMultilingualArgs(fieldConfig, multilingualInputTypes);

        /**
         * Do not patch field resolver if there is no multilingual directives and fields on it
         */
        if (!directiveArgumentMap && !withMultilingualArgs) {
          return;
        }

        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async (parent, args, context: ResolverContextBase, info): Promise<unknown> => {
          const currentLanguage = context.languages[0].toLowerCase();

          /**
           * Map multilingual args if any
           */
          if (fieldConfig.astNode?.arguments && isWithMultilingualArgs) {
            mapArgs(args, fieldConfig.astNode.arguments, currentLanguage);
          }

          /**
           * Execute original resolver
           */
          const result = await resolve(parent, args, context, info);

          /**
           * Map output multilingual fields
           */
          if (directiveArgumentMap) {
            return result && result[currentLanguage];
          }

          return result;
        };

        return fieldConfig;
      },
    });
  };
}
