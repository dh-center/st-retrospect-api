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
    User saved routes
    """
    savedRoutes: [Route!]!

    """
    User liked routes
    """
    likedRoutes: [Route!]!

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
  }

  extend type Query {
    """
    Get info about user
    """
    me: User! @authCheck
  }

  extend type Mutation {
    """
    Save route to user
    """
    saveRoute(routeId: String!): User! @authCheck

    """
    Unsave route from user
    """
    deleteRouteFromSaved(routeId: String!): User! @authCheck

    """
    Add route to user liked routes
    """
    likeRoute(routeId: String!): User! @authCheck

    """
    Dislike route
    """
    dislikeRoute(routeId: String!): User! @authCheck
  }
`;
