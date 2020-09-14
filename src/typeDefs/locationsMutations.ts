import { gql } from 'apollo-server-express';

export default gql`
  input CreateLocationInput {
    """
    Location coordinate by X
    """
    coordinateX: Float!

    """
    Location coordinate by Y
    """
    coordinateY: Float!

    """
    Possible location representations
    """
    instances: [LocationInstanceInput!]!
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
    recordId: ObjectId!

    """
    Created location
    """
    record: Location! @dataLoader(dataLoaderName: "locationById", fieldName: "recordId")
  }

  input UpdateLocationInput {
    """
    Location id to update
    """
    id: ObjectId!

    """
    Location coordinate by X
    """
    coordinateX: Float

    """
    Location coordinate by Y
    """
    coordinateY: Float

    """
    Possible location instances id
    """
    instances: [ObjectId!]!
  }

  type UpdateLocationPayload {
    """
    Updated location id
    """
    recordId: ID!

    """
    Updated location
    """
    record: Location!
  }

  type DeleteLocationPayload {
    """
    Deleted location id
    """
    recordId: ID!
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
    delete(id: ID!): DeleteLocationPayload! @adminCheck
  }

  extend type Mutation {
    location: LocationMutations!
  }
`;
