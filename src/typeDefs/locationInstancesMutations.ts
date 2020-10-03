import { gql } from 'apollo-server-express';

export default gql`
  input CreateLocationInstanceInput {
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

    """
    Location id to which this instance below
    """
    locationId: GlobalId!
  }

  type CreateLocationInstancePayload {
    """
    Created location id
    """
    recordId: GlobalId! @toGlobalId(type: "LocationInstance")

    """
    Created location
    """
    record: LocationInstance!
  }

  input UpdateLocationInstanceInput {
    """
    Location instance id
    """
    id: GlobalId!

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

  type UpdateLocationInstancePayload {
    """
    Created location id
    """
    recordId: GlobalId! @toGlobalId(type: "LocationInstance")

    """
    Created location
    """
    record: LocationInstance!
  }

  type DeleteLocationInstancePayload {
    """
    Created location id
    """
    recordId: GlobalId! @toGlobalId(type: "LocationInstance")
  }

  type LocationInstanceMutations {
    """
    Create location instance
    """
    create(input: CreateLocationInstanceInput!): CreateLocationInstancePayload! @adminCheck

    """
    Update location instance
    """
    update(input: UpdateLocationInstanceInput!): UpdateLocationInstancePayload! @adminCheck

    """
    Delete location instance
    """
    delete(id: GlobalId!): DeleteLocationInstancePayload! @adminCheck
  }

  extend type Mutation {
    locationInstances: LocationInstanceMutations!
  }
`;
