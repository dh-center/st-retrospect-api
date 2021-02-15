import { gql } from 'apollo-server-express';

export default gql`
  type User implements Node {
    """
    User's ID
    """
    id: ID! @fromField(name: "_id")

    """
    Username
    """
    username: String!

    """
    User profile photo url
    """
    photo: String

    """
    User first name
    """
    firstName: String

    """
    User last name
    """
    lastName: String

    """
    Quests that user complete
    """
    completedQuests: [Quest!]! @dataLoader(dataLoaderName: "questById", fieldName: "completedQuestsIds") @default(value: "[]")

    """
    User experience
    """
    exp: Int! @default(value: "0")

    """
    User level
    """
    level: Int!

    """
    Array of user permission
    """
    permissions: [String!]!
  }

  """
  Model for representing list of persons
  """
  type UserConnection {
    """
    List of persons edges
    """
    edges: [UserEdge!]!

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
  Information about specific person in connection
  """
  type UserEdge {
    """
    Cursor of this person
    """
    cursor: Cursor!

    """
    Person info
    """
    node: User!
  }

  extend type Query {
    """
    Get info about user
    """
    me: User! @authCheck

    """
    Returns connection with all users
    """
    users(
      "The cursor after which we take the data"
      after: Cursor,

      "The cursor after before we take the data"
      before: Cursor,

      "Number of requested nodes after a node with a cursor in the after argument"
      first: Int,

      "Number of requested nodes before a node with a cursor in the before argument"
      last: Int
    ): UserConnection! @adminCheck @pagination(collectionName: "users")
  }
`;
