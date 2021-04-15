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

  extend type Query {
    """
    Search for entities by search query
    """
    locationsInstancesSearch(input: SearchInput!): LocationInstanceConnection!
  }
`;
