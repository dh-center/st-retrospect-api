import { gql } from 'apollo-server-express';

export default gql`
  """
  Location type to add it to Location
  """
  type LocationType {
    """
    LocationType's ID
    """
    id: ID! @renameField(name: "_id")

    """
    LocationTypes's name
    """
    name: JSON
  }

  """
  Location address representation
  """
  type Address {
    """
    Address's ID
    """
    id: ID! @renameField(name: "_id")

    """
    Street on which the location is located
    """
    street: JSON

    """
    Build name
    """
    build: JSON

    """
    House number on the street
    """
    homeNumber: String

    """
    Corps of home
    """
    housing: String

    """
    Link for location info
    """
    link: String
  }

  """
  Location for displaying on map and making relations with persons
  """
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
    photoLinks: [String]

    """
    Link with main photo
    """
    mainPhotoLink: String

    """
    Array of location's types
    """
    locationTypes: [LocationType!]!

    """
    Array of addresses ids
    """
    addresses: [Address!]!

    """
    Location relations
    """
    relations: [Relation!]!
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
    Get relations on user request
    """
    search(
      "The string on the basis of which the request will be made"
      searchString: String!
    ): [Relation!]!
  }
`;
