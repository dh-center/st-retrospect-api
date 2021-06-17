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
    User's achievements
    """
    receivedAchievements: [Achievement!]! @dataLoader(dataLoaderName: "achievementById", fieldName: "receivedAchievementsIds") @default(value: "[]")

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
    permissions: [String!]! @default(value: "[]")

    """
    Accepted user friends
    """
    friends: [User!]! @dataLoader(dataLoaderName: "userById", fieldName: "friendsIds") @default(value: "[]")

    """
    Unaccepted friend requests to other users
    """
    friendPendingRequests: [User!]! @dataLoader(dataLoaderName: "userById", fieldName: "friendPendingRequestsIds") @default(value: "[]")

    """
    Friend requests to user
    User can accept or reject them
    """
    friendRequests: [User!]! @dataLoader(dataLoaderName: "userById", fieldName: "friendRequestsIds") @default(value: "[]")
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
    Get specific User
    """
    user(
      "User id"
      id: GlobalId!
    ): User @adminCheck @dataLoader(dataLoaderName: "userById", argName: "id")

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

    """
    Search users by username
    """
    usersSearch(username: String!): [User!]! @authCheck
  }
`;
