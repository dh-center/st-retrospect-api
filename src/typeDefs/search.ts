import { gql } from 'apollo-server-express';

export default gql`
  union SearchResult = LocationInstance | Person | Quest

  input SearchInput {
    query: String!
  }

  extend type Query {
    search(input: SearchInput!): [SearchResult]!
  }
`;
