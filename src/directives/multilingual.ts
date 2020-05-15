import { SchemaDirectiveVisitor } from 'graphql-tools';
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLArgument,
  GraphQLObjectType,
  GraphQLInterfaceType,
  isInputObjectType, GraphQLInputField, GraphQLInputObjectType
} from 'graphql';
import { ResolverContextBase } from '../types/graphql';

/**
 * Directive for picking only necessary language from multilingual fields
 */
export default class Multilingual extends SchemaDirectiveVisitor {
  /**
   * @param field - GraphQL field definition
   */
  visitFieldDefinition(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: GraphQLField<any, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): GraphQLField<any, any> | void | null {
    const { resolve = defaultFieldResolver } = field;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field.resolve = async (object, args, context: ResolverContextBase, info): Promise<any> => {
      const value = resolve.call(this, object, args, context, info);

      if (!value) {
        return null;
      }
      if (value instanceof Array) {
        return value.map(arrayValue => arrayValue && arrayValue[context.languages[0].toLowerCase()]);
      }
      return value[context.languages[0].toLowerCase()];
    };
  }

  visitInputFieldDefinition(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: GraphQLInputField, details: {
      objectType: GraphQLInputObjectType;}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): GraphQLInputField | void | null {
    super.visitInputFieldDefinition(field, details);
  }

  visitArgumentDefinition(
    argument: GraphQLArgument,
    details: { field: GraphQLField<any, any>; objectType: GraphQLObjectType | GraphQLInterfaceType }
  ): GraphQLArgument | void | null {
    const { resolve = defaultFieldResolver } = details.field;

    const fieldNames: string[] = [];

    const argumentType = argument.type;

    if (isInputObjectType(argumentType)) {
      Object.entries(argumentType.getFields()).forEach(([fieldName, fieldData]) => {
        const directives = fieldData.astNode && fieldData.astNode.directives;

        if (directives && directives.findIndex(directive => directive.name.value.toString() === 'multilingual') !== -1) {
          fieldNames.push(fieldName);
        }
      });
    }

    details.field.resolve = async (object, args, context, info): Promise<void> => {
      fieldNames.map(fieldName => {
        args.input[fieldName] = {
          [context.languages[0].toLowerCase()]: args.input[fieldName]
        };
      });
      return resolve.call(this, object, args, context, info);
    };
  }
}
