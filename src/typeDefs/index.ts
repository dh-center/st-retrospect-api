import { gql, concatenateTypeDefs } from 'apollo-server-express';

import persons from './persons';

const rootSchema = gql`
  enum Languages {
    en
    ru
  }
  
  type Query {
    health: String!
  }
`;

export default concatenateTypeDefs(
  [
    rootSchema,
    persons
  ]
);
