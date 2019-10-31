import { gql } from 'apollo-server-express';

export default gql`
  """
  Route between locations
  """
  type Route {
    """
    Route id
    """
    id: ID! @renameField(name: "_id")

    """
    Route name
    """
    name: JSON!
    """
    Route locations
    """
    locations: [Location!]!
    
    """
    Route description
    """
    description: JSON!
    
    """
    Route photo
    """
    photoLink: String
  }
  
  input Coordinates {
    longitude: Float!
    latitude: Float!
  }
  
  extend type Query {
    """
    Get all routes
    """
    routes: [Route!]!
    
    """
    Get nearest routes
    """
    nearestRoutes(
      "Center coordinates"
      center: Coordinates!
      
      "Search radius"
      radius: Float = 4000
    ): [Route!]!
    
    """
    Get specific route by id
    """
    route(
      "Route id"
      id: ID!
    ): Route
  }
`;
