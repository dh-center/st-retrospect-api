import { gql } from 'apollo-server-express';

export default gql`
  type Location {
    """
    Location's ID
    """
    id: ID! @renameField(name: "_id")

    """
    Location's name
    """
    name: JSON

    """
    Location's description
    """
    description: JSON

    """
    Location's construction date
    """
    constructionDate: String

    """
    Location's demolition date
    """
    demolitionDate: String

    """
    Link for location info
    """
    wikiLink: String

    """
    Location coordinate by X
    """
    coordinateX: Float

    """
    Location coordinate by Y
    """
    coordinateY: Float

    """
    Contains links with location's photos
    """
    photoLinks: String

    """
    Link with main photo
    """
    mainPhotoLink: String
  }

  extend type Query {
    """
    Get specific location
    """
    location(
      "Location id"
      id: ID!
    ): Location

    """
    Get all locations
    """
    locations: [Location!]!

    """
    Get locations on user request
    """
    search(
      "The string on the basis of which the request will be made"
      searchString: String!
    ): [Location!]!
  }
`;
