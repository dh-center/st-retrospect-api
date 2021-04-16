import { gql } from 'apollo-server-express';

export default gql`
  input WindowedPaginationArgs {
    skip: Int
    first: Int
  }

  input CursoredPaginationArgs {
    "The cursor after which we take the data"
    after: Cursor

    "The cursor after before we take the data"
    before: Cursor

    "Number of requested nodes after a node with a cursor in the after argument"
    first: Int

    "Number of requested nodes before a node with a cursor in the before argument"
    last: Int
  }


  """
  Search query input
  """
  input SearchInput {
    """
    Query string
    """
    query: String!

    """
    Start of search range
    """
    startYear: Int

    """
    End of search range
    """
    endYear: Int

    """
    Entity category
    """
    category: [String!]

    windowedPagination: WindowedPaginationArgs
#    cursorPagination: CursoredPaginationArgs
  }

  """
  Model for representing list of locations
  """
  type LocationSearchConnection {
    """
    List of locations edges
    """
    edges: [LocationEdge!]!

    """
    Information about this page
    """
    pageInfo: PageInfo!

    """
    Number of available edges
    """
    totalCount: Int!

    suggest: String
  }

  extend type Query {
    """

    """
    locationInstancesSearch(input: SearchInput!): LocationInstanceConnection!
    locationsSearch(input: SearchInput!): LocationSearchConnection!
  }
`;
