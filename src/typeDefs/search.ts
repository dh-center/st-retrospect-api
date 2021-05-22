import { gql } from 'apollo-server-express';

export default gql`
  """
  Args for implementing windowed pagination
  """
  input WindowedPaginationArgs {
    """
    How many documents in the selection to skip
    """
    skip: Int

    """
    How many documents to fetch
    """
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

    """
    Args for implementing windowed pagination
    """
    windowedPagination: WindowedPaginationArgs

    """
    Args for implementing cursor-based pagination
    """
    cursorPagination: CursoredPaginationArgs
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

    """
    Proposed query if user made a typo
    """
    suggest: String
  }

  extend type Query {
    """
    Query for search over the location instances
    """
    locationInstancesSearch(input: SearchInput!): LocationInstanceConnection!

    """
    Query for search over the locations
    """
    locationsSearch(input: SearchInput!): LocationSearchConnection!

    """
    Query for searching location instances related with some person
    """
    locationInstanceByPersonSearch(input: SearchInput!): LocationInstanceConnection!
  }
`;
