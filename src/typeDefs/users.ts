import { gql } from 'apollo-server-express';

export default gql`
  type User {
    """
    User's ID
    """
    id: ID! @renameField(name: "_id")

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
  }

  extend type Query {
    """
    Get info about user
    """
    me: User!
  }
  
  extend type Mutation {
    """
    Save route to user
    """  
    saveRoute(routeId: String!): User!

    """
    Unsave route from user
    """
    deleteRouteFromSaved(routeId: String!): User!
      
    """
    Add route to user liked routes
    """
    likeRoute(routeId: String!): User!

    """
    Dislike route
    """
    dislikeRoute(routeId: String!): User!
  }
`;
