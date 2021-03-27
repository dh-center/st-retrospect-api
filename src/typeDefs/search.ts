import { gql } from 'apollo-server-express';

export default gql`
  input SearchInput {
    query: String!
  }

  union SearchResult = LocationInstance | Person | Quest

  extend type Query {
    search(input: SearchInput): [SearchResult!]!
  }
`;
