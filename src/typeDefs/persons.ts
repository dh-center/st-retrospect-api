import { gql } from 'apollo-server-express';

export default gql`  
  type Person {
    id: ID!
    firstName: String
  }
  
  extend type Query {
    person(id: ID!, languages: [Languages]!): Person
  }
`;
