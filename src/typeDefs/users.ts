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
  }

  extend type Query {
    """
    Get info about user
    """
    me: User! @authCheck
  }
`;
