import { gql } from 'apollo-server-express';

export default gql`
  """
  Represents relation between person and location
  """
  type Relation implements Node {
    """
    Relation's id
    """
    id: ID! @fromField(name: "_id")

    """
    Person in relation
    """
    person: Person @dataLoader(dataLoaderName: "personById", fieldName: "personId")

    """
    Location in relation
    """
    locationInstance: LocationInstance @dataLoader(dataLoaderName: "locationInstanceById", fieldName: "locationInstanceId")

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
  Model for representing list of relations
  """
  type RelationConnection {
    """
    List of persons edges
    """
    edges: [RelationEdge!]!

    """
    Information about this page
    """
    pageInfo: PageInfo!

    """
    Number of available edges
    """
    totalCount: Int!
  }

  """
  Information about specific relation in connection
  """
  type RelationEdge {
    """
    Cursor of this person
    """
    cursor: Cursor!

    """
    Person info
    """
    node: Relation!
  }

  """
  Represents one of the relations types
  """
  type RelationType implements Node {
    """
    Relation type id
    """
    id: ID! @fromField(name: "_id")

    """
    Relation type name
    """
    name: String @multilingual

    """
    Relation type synonyms
    """
    synonyms: [String] @multilingual
  }
  extend type Query {
    """
    Get specific relation
    """
    relation (
      "Relation id"
      id: GlobalId!
    ): Relation @dataLoader(dataLoaderName: "relationById", argName: "id")

    """
    Get all relations
    """
    relations(
      "The cursor after which we take the data"
      after: Cursor,

      "The cursor after before we take the data"
      before: Cursor,

      "Number of requested nodes after a node with a cursor in the after argument"
      first: Int,

      "Number of requested nodes before a node with a cursor in the before argument"
      last: Int
    ): RelationConnection! @pagination(collectionName: "relations")
  }
`;
