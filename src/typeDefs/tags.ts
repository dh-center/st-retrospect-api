import { gql } from 'apollo-server-express';

export default gql`
  """
  Tag of person or location instance
  """
  type Tag implements Node {
    """
    Tag id
    """
    id: ID! @fromField(name: "_id")

    """
    Tag value
    Can be multilingual
    """
    value: MultilingualString! @multilingual
  }

  """
  Information about specific tag in connection
  """
  type TagEdge {
    """
    Cursor of current tag
    """
    cursor: Cursor!

    """
    Tag object
    """
    node: Tag!
  }

  """
  Model for representing page of tags
  """
  type TagConnection {
    """
    List of tags on current page
    """
    edges: [TagEdge!]!

    """
    Information about current page
    """
    pageInfo: PageInfo!

    """
    Number of available edges on current page
    """
    totalCount: Int!
  }

  extend type Query {
    """
    Get specific tag
    """
    tag(
      "Tag id"
      id: GlobalId!
    ): Tag @dataLoader(dataLoaderName: "tagById", argName: "id")

    """
    List of available tags
    """
    tags(
      "The cursor after which we take the data"
      after: Cursor,

      "The cursor after before we take the data"
      before: Cursor,

      "Number of requested nodes after a node with a cursor in the after argument"
      first: Int,

      "Number of requested nodes before a node with a cursor in the before argument"
      last: Int
    ): TagConnection! @pagination(collectionName: "tags")
  }
`;
