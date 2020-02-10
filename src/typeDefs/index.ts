import { gql, concatenateTypeDefs } from 'apollo-server-express';

import persons from './persons';
import locations from './locations';
import relations from './relations';
import routes from './routes';
import users from './users';

const rootSchema = gql`
  """
  Directive for field renaming
  """
  directive @renameField(name: String!) on FIELD_DEFINITION
  """
  Directive to filter the language
  """
  directive @multilingual on FIELD_DEFINITION
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

  """
  API mutations
  """
  type Mutation {
    """
    Unused field to let extend this type
    """
    _: Boolean
  }
`;

export default concatenateTypeDefs(
  [
    rootSchema,
    persons,
    locations,
    relations,
    routes,
    users
  ]
);
