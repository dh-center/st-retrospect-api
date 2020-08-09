import { gql, concatenateTypeDefs } from 'apollo-server-express';

import persons from './persons';
import locations from './locations';
import relations from './relations';
import routes from './routes';
import users from './users';
import quests from './quests';
import graphqlScalars from './graphqlScalars';

const rootSchema = gql`
  """
  Extracts value from specified field in parent object
  """
  directive @fromField(name: String!) on FIELD_DEFINITION

  """
  Directive for multilingual fields support

  On input field maps provided value to multilingual object (e.g. 'hello' => {en: 'hello'})
  On type field maps multilingual object to value ({en: 'hello'} => 'hello')
  """
  directive @multilingual on FIELD_DEFINITION | INPUT_FIELD_DEFINITION

  """
  Load data via specific dataLoader
  """
  directive @dataLoader(
    """
    Name of needed DataLoader
    """
    dataLoaderName: String!

    """
    Name of field with data for DataLoader
    """
    fieldName: String

    """
    Arg name to extract id from
    """
    argName: String

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
    graphqlScalars,
  ]
);
