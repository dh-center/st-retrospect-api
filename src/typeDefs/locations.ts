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
    name: String @multilingual
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
    street: String @multilingual

    """
    Build name
    """
    build: String @multilingual

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
  Location context. This can be a time period, a special description for a particular route, etc.
  """
  type Instance {
    """
    Instance's ID
    """
    id: ID! @renameField(name: "_id")

    """
    Location's name
    """
    name: String @multilingual

    """
    Location's description
    """
    description: String @multilingual

    """
    Link for location info
    """
    wikiLink: String

    """
    Array of location's types
    """
    locationTypes: [LocationType] @dataLoader(dataLoaderName: "locationTypeById", fieldName: "locationTypesId")

    """
    Contains links with location's photos
    """
    photoLinks: [String]

    """
    Link with main photo
    """
    mainPhotoLink: String

    """
    Location's construction date
    """
    constructionDate: String

    """
    Location's demolition date
    """
    demolitionDate: String

    """
    Start of period
    """
    startDate: String

    """
    End of period
    """
    endDate: String
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
    Location coordinate by X
    """
    coordinateX: Float

    """
    Location coordinate by Y
    """
    coordinateY: Float

    """
    Array of addresses ids
    """
    addresses: [Address] @dataLoader(dataLoaderName: "addressesById", fieldName: "addressesId")

    """
    Location relations
    """
    relations: [Relation!]! @dataLoader(dataLoaderName: "relationByLocationId", fieldName: "_id")

    """
    Array of architects
    """
    architects: [Person]

    """
    Possible location representations
    """
    instances: [Instance]
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
