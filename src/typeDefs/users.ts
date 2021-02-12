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
    User experience
    """
    exp: Int!

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
