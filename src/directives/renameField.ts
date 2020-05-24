import { SchemaDirectiveVisitor } from 'graphql-tools';
import {
  defaultFieldResolver,
  GraphQLArgument,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputObjectType, GraphQLInterfaceType,
  GraphQLObjectType, isInputObjectType
} from 'graphql';

/**
 * Directive for renaming type fields
 */
export default class RenameFieldDirective extends SchemaDirectiveVisitor {
  /**
   * Method to be called on field visit
   * @param field - GraphQL field definition
   */
  visitFieldDefinition(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: GraphQLField<any, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): GraphQLField<any, any> | void | null {
    const { name } = this.args;
    const { resolve = defaultFieldResolver } = field;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field.resolve = async (object, args, context, info): Promise<any> => {
      object[field.name] = object[name];
      return resolve.call(this, object, args, context, info);
    };
  }

  /**
   * @param field - GraphQL input field definition
   * @param details - GraphQL type containing field
   */
  visitInputFieldDefinition(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: GraphQLInputField, details: {
      objectType: GraphQLInputObjectType;}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): GraphQLInputField | void | null {
    super.visitInputFieldDefinition(field, details);
  }

  /**
   * @param argument - GraphQL argument definition
   * @param details - GraphQL field and type containing argument
   */
  visitArgumentDefinition(
    argument: GraphQLArgument,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details: { field: GraphQLField<any, any>; objectType: GraphQLObjectType | GraphQLInterfaceType }
  ): GraphQLArgument | void | null {
    const { name } = this.args;
    const { resolve = defaultFieldResolver } = details.field;

    const fieldNames: string[] = [];
    const argumentType = argument.type;

    if (isInputObjectType(argumentType)) {
      Object.entries(argumentType.getFields()).forEach(([fieldName, fieldData]) => {
        const directives = fieldData.astNode && fieldData.astNode.directives;

        if (directives && directives.findIndex(directive => directive.name.value.toString() === 'renameField') !== -1) {
          fieldNames.push(fieldName);
        }
      });
    }

    details.field.resolve = async (object, args, context, info): Promise<any> => {
      fieldNames.map(fieldName => {
        args.input[name] = args.input[fieldName];
      });
      return resolve.call(this, object, args, context, info);
    };
  }
}
