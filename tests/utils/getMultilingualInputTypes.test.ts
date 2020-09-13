import { buildSchema } from 'graphql';
import getMultilingualInputTypes from '../../src/utils/getMultilingualInputTypes';

describe('getMultilingualInputTypes', () => {
  test('should return correct input types with direct multilingual fields', () => {
    // language=GraphQL
    const schema = buildSchema(`
      directive @multilingual on FIELD_DEFINITION | INPUT_FIELD_DEFINITION

      input CreatePersonInput {
        firstName: String! @multilingual
        link: String!
        lastName: String! @multilingual
      }
    `);

    const result = getMultilingualInputTypes(schema);

    expect(result).toEqual({
      CreatePersonInput: ['firstName', 'lastName'],
    });
  });

  test('should return correct input types with nested multilingual fields', () => {
    // language=GraphQL
    const schema = buildSchema(`
      directive @multilingual on FIELD_DEFINITION | INPUT_FIELD_DEFINITION

      input CreateLocationInstanceInput {
        name: String! @multilingual
      }

      input CreateLocationInput {
        longitude: Float!
        lantitude: Float!
        instance: CreateLocationInstanceInput
      }
    `);

    const result = getMultilingualInputTypes(schema);

    expect(result).toEqual({
      CreateLocationInstanceInput: [ 'name' ],
      CreateLocationInput: [ 'instance' ],
    });
  });

  test('should return correct input types with multilingual fields with circular deps', () => {
    // language=GraphQL
    const schema = buildSchema(`
      directive @multilingual on FIELD_DEFINITION | INPUT_FIELD_DEFINITION

      input AInput {
        name: String! @multilingual
        b: BInput!
      }

      input BInput {
        longitude: Float!
        lantitude: Float!
        instance: AInput!
      }
    `);

    const result = getMultilingualInputTypes(schema);

    expect(result).toEqual({
      AInput: ['name', 'b'],
      BInput: [ 'instance' ],
    });
  });

  test('should return correct input types with deep nested multilingual fields with circular deps', () => {
    // language=GraphQL
    const schema = buildSchema(`
      directive @multilingual on FIELD_DEFINITION | INPUT_FIELD_DEFINITION

      input AInput {
        name: String! @multilingual
        b: BInput!
      }

      input BInput {
        longitude: Float!
        lantitude: Float!
        instance: AInput!
      }

      input CInput {
        test: AInput
      }

      input DInput {
        test: CInput!
        name: Float! @multilingual
      }
    `);

    const result = getMultilingualInputTypes(schema);

    expect(result).toEqual({
      AInput: ['name', 'b'],
      BInput: [ 'instance' ],
      CInput: [ 'test' ],
      DInput: ['test', 'name'],
    });
  });
});
