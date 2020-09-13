import { graphql } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import multilingual from '../../src/directives/multilingual';

describe('Multilingual directive', () => {
  test('Should convert multilingual fields in input type', async () => {
    const mockedResolver = jest.fn();
    const schema = makeExecutableSchema({
      // language=GraphQL
      typeDefs: `
        directive @multilingual on FIELD_DEFINITION | INPUT_FIELD_DEFINITION

        input CreatePersonInput {
          firstName: String! @multilingual
          link: String!
          lastName: String! @multilingual
        }


        type Query {
          rootValue(input: CreatePersonInput!): Boolean
        }
      `,
      resolvers: {
        Query: {
          rootValue: mockedResolver,
        },
      },
      schemaTransforms: [ multilingual('multilingual') ],
    });

    const { data, errors } = await graphql(
      schema,
      // language=GraphQL
      `
        query {
          rootValue(input: {firstName: "adb", link: "http://", lastName: "qwe"})
        }
      `,
      undefined,
      { languages: [ 'RU' ] }
    );

    expect(data).toBeDefined();
    expect(errors).toBeUndefined();
    expect(mockedResolver.mock.calls[0][1].input).toEqual({
      firstName: { ru: 'adb' },
      link: 'http://',
      lastName: { ru: 'qwe' },
    });
  });

  test('Should convert nested multilingual fields in input type', async () => {
    const mockedResolver = jest.fn();
    const schema = makeExecutableSchema({
      // language=GraphQL
      typeDefs: `
        directive @multilingual on FIELD_DEFINITION | INPUT_FIELD_DEFINITION

        input CreateLocationInstanceInput {
          name: String! @multilingual
        }

        input CreateLocationInput {
          longitude: Float!
          latitude: Float!
          instance: CreateLocationInstanceInput
        }

        type Query {
          rootValue(input: CreateLocationInput!): Boolean
        }
      `,
      resolvers: {
        Query: {
          rootValue: mockedResolver,
        },
      },
      schemaTransforms: [ multilingual('multilingual') ],
    });

    const { data, errors } = await graphql(
      schema,
      // language=GraphQL
      `
        query {
          rootValue(input: {longitude: 234.3, latitude: 235, instance: {name: "kek"} })
        }
      `,
      undefined,
      { languages: [ 'RU' ] }
    );

    expect(data).toBeDefined();
    expect(errors).toBeUndefined();
    expect(mockedResolver.mock.calls[0][1].input).toEqual({
      longitude: 234.3,
      latitude: 235,
      instance: { name: { ru: 'kek' } },
    });
  });
});
