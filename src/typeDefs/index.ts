import { gql, concatenateTypeDefs } from 'apollo-server-express';

import persons from './persons';

const rootSchema = gql`
  """
  Type for representing JSON object
  """
  scalar JSON
  
  """
  Supported languages for data
  """
  enum Languages {
    EN
    RU
  }
  
  """
  API queries
  """
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
