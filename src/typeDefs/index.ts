import { gql, concatenateTypeDefs } from 'apollo-server-express';

import persons from './persons';
import locations from './locations';
import relations from './relations';
import routes from './routes';
import users from './users';
import quests from './quests';

const rootSchema = gql`
  """
  Directive for field renaming
  """
  directive @fromField(name: String!) on FIELD_DEFINITION

  directive @renameField(name: String!) on INPUT_FIELD_DEFINITION

  """
  Directive for picking only necessary language from multilingual fields
  """
  directive @multilingual on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION

  """
  Directive for data loaders
  """
  directive @dataLoader(
    """
    Name of needed DataLoader
    """
    dataLoaderName: String!

    """
    Name of field with data for DataLoader
    """
    fieldName: String!
  ) on FIELD_DEFINITION

  """
  Directive for pagination according to the Relay specification
  """
  directive @pagination(collectionName: String!) on FIELD_DEFINITION

  """
  Directive for checking user authorization
  """
  directive @authCheck on FIELD_DEFINITION

  """
  Directive for checking admin permissions
  """
  directive @adminCheck on FIELD_DEFINITION

  """
  Type for representing JSON object
  """
  scalar JSON

  """
  Type for representing connections cursors
  """
  scalar Cursor

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
    users,
    quests,
  ]
);
