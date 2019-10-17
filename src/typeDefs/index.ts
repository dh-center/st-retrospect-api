import { gql, concatenateTypeDefs } from 'apollo-server-express';

import persons from './persons';
import locations from './locations';
import relations from './relations';
import routes from './routes';

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
    """
    Healthcheck endpoint
    """
    health: String!
  }
`;

export default concatenateTypeDefs(
  [
    rootSchema,
    persons,
    locations,
    relations,
    routes
  ]
);
