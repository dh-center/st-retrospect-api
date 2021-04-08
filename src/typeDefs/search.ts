import { gql } from 'apollo-server-express';

export default gql`
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
    startYear: Int!

    """
    End of search range
    """
    endYear: Int!

    """
    Entity category
    """
    category: [String!]
  }

  """
  Possible data types that the search might return
  """
  union SearchResult = LocationInstance | Person | Quest

  extend type Query {
    """
    Search for entities by search query
    """
    search(input: SearchInput!): [SearchResult!]!
  }
`;
