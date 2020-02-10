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
    person: Person

    """
    Location in relation
    """
    location: Location

    """
    Relation type
    """
    relationType: RelationType

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
    synonyms: [JSON]
  }
`;
