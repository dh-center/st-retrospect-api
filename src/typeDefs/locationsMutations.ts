import { gql } from 'apollo-server-express';

export default gql`
  """
  Input type for updating address in location
  """
  input UpdateAddressInput {
    """
    Unique country code from ISO 3166
    """
    countryCode: String

    """
    Unique region code from ISO 3166
    """
    regionCode: String

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
  Input type for specifying address in new location
  """
  input CreateAddressInput {
    """
    Unique country code from ISO 3166
    """
    countryCode: String!

    """
    Unique region code from ISO 3166
    """
    regionCode: String!

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
    address: MultilingualString! @multilingual

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
  Input for creating new location
  """
  input CreateLocationInput {
    """
    Location position latitude
    """
    latitude: Float!

    """
    Location position longitude
    """
    longitude: Float!

    """
    Possible location representations
    """
    instances: [LocationInstanceInput!]!

    """
    Address to bind to new location
    """
    addresses: [CreateAddressInput!]!
  }

  input LocationInstanceInput {
    """
    Location's name
    """
    name: MultilingualString! @multilingual

    """
    Location's description
    """
    description: MultilingualString! @multilingual

    """
    Link for location info
    """
    wikiLink: String

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
  }


  type CreateLocationPayload {
    """
    Created location id
    """
    recordId: GlobalId! @toGlobalId(type: "Location")

    """
    Created location
    """
    record: Location! @dataLoader(dataLoaderName: "locationById", fieldName: "recordId")
  }

  input UpdateLocationInput {
    """
    Location id to update
    """
    id: GlobalId!

    """
    Location position latitude
    """
    latitude: Float

    """
    Location position longitude
    """
    longitude: Float

    """
    Updated location address
    """
    addresses: [UpdateAddressInput!]
  }

  type UpdateLocationPayload {
    """
    Updated location id
    """
    recordId: GlobalId! @toGlobalId(type: "Location")

    """
    Updated location
    """
    record: Location!
  }

  type DeleteLocationPayload {
    """
    Deleted location id
    """
    recordId: GlobalId! @toGlobalId(type: "Location")
  }

  type LocationMutations {
    """
    Create location
    """
    create(input: CreateLocationInput!): CreateLocationPayload! @adminCheck

    """
    Update location
    """
    update(input: UpdateLocationInput!): UpdateLocationPayload! @adminCheck

    """
    Delete location
    """
    delete(id: GlobalId!): DeleteLocationPayload! @adminCheck
  }

  extend type Mutation {
    location: LocationMutations!
  }
`;
