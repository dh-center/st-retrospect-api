import { graphql, GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import multilingual from '../../src/directives/multilingual';

describe('Multilingual directive', () => {
  test('Should convert multilingual input type fields', async () => {
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

    await graphql(
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

    expect(mockedResolver.mock.calls[0][1].input).toEqual({
      firstName: { ru: 'adb' },
      link: 'http://',
      lastName: { ru: 'qwe' },
    });
  });
});
