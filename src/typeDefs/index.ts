import { gql, concatenateTypeDefs } from 'apollo-server-express';

import persons from './persons';
import locations from './locations';
import relations from './relations';
import relationTypes from './relationTypes';
import users from './users';
import quests from './quests';
import graphqlScalars from './graphqlScalars';
import questsMutations from './questsMutations';
import locationsMutations from './locationsMutations';
import locationInstancesMutations from './locationInstancesMutations';
import relationsMutations from './relationsMutations';
import relationTypesMutations from './relationTypesMutations';
import locationStyles from './locationStyles';
import usersMutations from './usersMutations';

const rootSchema = gql`
  """
  An object with a Globally Unique ID
  """
  interface Node {
    """
    The ID of the object.
    """
    id: ID!
  }

  """
  Directive for applying default values to nullable fields
  """
  directive @default(value: String!) on FIELD_DEFINITION

  """
  Converts MongoDB ObjectId value to the Global Unique ID
  """
  directive @toGlobalId(type: String!) on FIELD_DEFINITION

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
  MongoDB ObjectId type
  """
  scalar ObjectId

  """
  Represents data that can be accessed in many languages
  """
  scalar MultilingualString

  """
  Unique global entity ID
  """
  scalar GlobalId

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
    node(id: ID!): Node
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

const schemaString =  concatenateTypeDefs(
  [
    rootSchema,
    persons,
    locations,
    locationStyles,
    locationsMutations,
    locationInstancesMutations,
    relations,
    relationsMutations,
    relationTypes,
    relationTypesMutations,
    users,
    quests,
    questsMutations,
    graphqlScalars,
    usersMutations,
  ]
);

export default schemaString;
