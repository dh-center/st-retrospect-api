import { gql } from 'apollo-server-express';

export default gql`
  """
  Represents relation between person and location
  """
  type Relation {
    """
    Relation's id
    """
    id: ID! @renameField(name: "_id")

    """
    Person in relation
    """
    person: Person @dataLoader(dataLoaderName: "personById", fieldName: "personId")

    """
    Location in relation
    """
    locationInstance: Instance @dataLoader(dataLoaderName: "locationInstanceById", fieldName: "locationInstanceId")

    """
    Relation type
    """
    relationType: RelationType @dataLoader(dataLoaderName: "relationTypeById", fieldName: "relationId")

    """
    Relation's quote
    """
    quote: String @multilingual
  }

  """
  Represents one of the relations types
  """
  type RelationType {
    """
    Relation type id
    """
    id: ID! @renameField(name: "_id")

    """
    Relation type name
    """
    name: String @multilingual

    """
    Relation type synonyms
    """
    synonyms: [String] @multilingual
  }
`;
