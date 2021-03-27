import { gql } from 'apollo-server-express';

export default gql`
  """
  Location type to add it to Location
  """
  type LocationType implements Node {
    """
    LocationType's ID
    """
    id: ID! @fromField(name: "_id")

    """
    LocationTypes's name
    """
    name: String @multilingual
  }

  """
  Country data in address of location
  """
  type Country implements Node {
    """
    Country identifier
    """
    id: ID! @fromField(name: "code")

    """
    ISO 3166 country code
    """
    code: String!

    """
    Country name
    """
    name: MultilingualString! @multilingual
  }

  """
  Region data in address of location
  """
  type Region implements Node {
    """
    Region identifier
    """
    id: ID! @fromField(name: "code")

    """
    ISO 3166 country code
    see https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
    """
    code: String!

    """
    Region name
    """
    name: MultilingualString! @multilingual
  }


  """
  Location address representation
  """
  type Address {
    """
    Country data
    """
    country: Country

    """
    Country region data
    """
    region: Region

    """
    City name, e.g. Saint-Petersburg
    """
    place: MultilingualString @multilingual

    """
    City district e.g. Адмиралтейский округ
    """
    locality: MultilingualString @multilingual

    """
    The first line of an address e.g. Пл. Никольская 1
    """
    address: MultilingualString @multilingual

    """
    An optional second line of an address
    """
    address2: MultilingualString @multilingual

    """
    Address postcode
    """
    postcode: MultilingualString @multilingual
  }

  """
  Location context. This can be a time period, a special description for a particular route, etc.
  """
  type LocationInstance implements Node {
    """
    Instance's ID
    """
    id: ID! @fromField(name: "_id")

    """
    Location's name
    """
    name: String @multilingual

    """
    Location
    """
    location: Location! @dataLoader(dataLoaderName: "locationById", fieldName: "locationId")

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
    Location style
    """
    locationStyle: LocationStyle @dataLoader(dataLoaderName: "locationStyleById", fieldName: "locationStyleId")

    """
    Contains links with location's photos
    """
    photoLinks: [String!]

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

    """
    Location relations
    """
    relations: [Relation!]! @dataLoader(dataLoaderName: "relationByLocationInstanceId", fieldName: "_id")

    """
    Array of architects
    """
    architects: [Person]

    """
    Source of information about location instance
    """
    source: MultilingualString @multilingual

    """
    Location instance tags
    """
    tags: [Tag!]! @dataLoader(dataLoaderName: "tagById", fieldName: "tagIds") @default(value: "[]")
  }

  """
  Location for displaying on map and making relations with persons
  """
  type Location implements Node {
    """
    Location's ID
    """
    id: ID! @fromField(name: "_id")

    """
    Location position latitude
    """
    latitude: Float

    """
    Location position longitude
    """
    longitude: Float

    """
    Array of addresses ids
    """
    addresses: [Address!]

    """
    Possible location representations
    """
    instances: [LocationInstance!]! @dataLoader(dataLoaderName: "locationInstanceById", fieldName: "locationInstanceIds")
  }

  """
  Model for representing list of locations
  """
  type LocationConnection {
    """
    List of locations edges
    """
    edges: [LocationEdge!]!

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
  Information about specific location in connection
  """
  type LocationEdge {
    """
    Cursor of this location
    """
    cursor: Cursor!

    """
    Location info
    """
    node: Location!
  }

  extend type Query {
    """
    Get specific location
    """
    location(
      "Location id"
      id: GlobalId!
    ): Location

    """
    Get all locations
    """
    locations(
      "The cursor after which we take the data"
      after: Cursor,

      "The cursor after before we take the data"
      before: Cursor,

      "Number of requested nodes after a node with a cursor in the after argument"
      first: Int,

      "Number of requested nodes before a node with a cursor in the before argument"
      last: Int
    ): LocationConnection! @pagination(collectionName: "locations")

    """
    Get specific locationInstances
    """
    locationInstance(
      "locationInstances id"
      id: GlobalId!
    ): LocationInstance

    """
    Get all locationInstances
    """
    locationInstances: [LocationInstance!]!

    """
    Get relations on user request
    """
    search(
      "The string on the basis of which the request will be made"
      searchString: String!
    ): [Relation!]!

    """
    Returns list of all location types
    """
    locationTypes: [LocationType!]!

    """
    Returns list of all location styles
    """
    locationStyles: [LocationStyle!]!
  }
`;
