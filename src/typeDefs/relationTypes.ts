import { gql } from 'apollo-server-express';

export default gql`
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
    name: MultilingualString! @multilingual

    """
    Relation type synonyms
    """
    synonyms: [MultilingualString]! @multilingual
  }

  """
  Information about specific relation type in connection
  """
  type RelationTypeEdge {
    """
    Cursor of this relation type
    """
    cursor: Cursor!

    """
    Relation type info
    """
    node: RelationType!
  }

  """
  Model for representing list of relation types
  """
  type RelationTypeConnection {
    """
    List of relation types edges
    """
    edges: [RelationTypeEdge!]!

    """
    Information about this page
    """
    pageInfo: PageInfo!

    """
    Number of available edges
    """
    totalCount: Int!
  }

  extend type Query {
    """
    Get specific relation type
    """
    relationType(
      "Relation type id"
      id: GlobalId!
    ): RelationType @dataLoader(dataLoaderName: "relationTypeById", argName: "id")

    """
    List of available relation types
    """
    relationTypes(
      "The cursor after which we take the data"
      after: Cursor,

      "The cursor after before we take the data"
      before: Cursor,

      "Number of requested nodes after a node with a cursor in the after argument"
      first: Int,

      "Number of requested nodes before a node with a cursor in the before argument"
      last: Int
    ): RelationTypeConnection! @pagination(collectionName: "relationtypes")
  }
`;
