import { gql } from 'apollo-server-express';

export default gql`
  input AddressInput {
    countryCode: String!
    regionCode: String!
    place: MultilingualString! @multilingual
    locality: MultilingualString! @multilingual
    address: MultilingualString! @multilingual
    address2: MultilingualString! @multilingual
    postcode: MultilingualString! @multilingual
  }


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

    addresses: [AddressInput!]!
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

    addresses: [AddressInput!]!
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
