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
    startYear: Int

    """
    End of search range
    """
    endYear: Int

    """
    Tag ids for filtering
    """
    tagIds: [GlobalId!]

    """
    How many documents in the selection to skip
    """
    skip: Int! = 0

    """
    How many documents to fetch
    """
    first: Int! = 20
  }

  """
  Model for representing result of locations search query
  """
  type LocationsSearchResult {
    """
    List of finded locations
    """
    nodes: [Location!]! @default(value: "[]")

    """
    Number of available result items
    """
    totalCount: Int!

    """
    Proposed query if user made a typo
    """
    suggest: String

    """
    Proposed query if user made a typo with indication of the place of it
    """
    highlightedSuggest: String
  }

  """
  Model for representing result of location instances search query
  """
  type RelationsSearchResult {
    """
    List of finded locations
    """
    nodes: [Relation!]! @default(value: "[]")

    """
    Number of available result items
    """
    totalCount: Int!

    """
    Proposed query if user made a typo
    """
    suggest: String

    """
    Proposed query if user made a typo with indication of the place of it
    """
    highlightedSuggest: String
  }

  extend type Query {
    """
    Query for search over the locations
    """
    locationsSearch(input: SearchInput!): LocationsSearchResult!

    """
    Query for searching location instances related with some person
    """
    relationsByPersonSearch(input: SearchInput!): RelationsSearchResult!
  }
`;
