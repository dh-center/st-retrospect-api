import { gql } from 'apollo-server-express';

export default gql`
  input CreateLocationInstanceInput {
    """
    Instance's ID
    """
    id: ID!

    """
    Location's name
    """
    name: String!

    """
    Location's description
    """
    description: String

    """
    Link for location info
    """
    wikiLink: String

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


  input CreateLocationInput {
    """
    Location coordinate by X
    """
    coordinateX: Float

    """
    Location coordinate by Y
    """
    coordinateY: Float

    """
    Possible location representations
    """
    instances: [String!]!
  }

  type CreateLocationPayload {
    """
    Created location id
    """
    recordId: ID!

    """
    Created location
    """
    record: Location!
  }

  input UpdateLocationInput {
    """
    Location ID
    """
    id: ID!

    """
    Location name
    """
    name: String

    """
    Location description
    """
    description: String

    """
    Location photo
    """
    photo: String

    """
    Location type (quiz, route, etc.)
    """
    type: TaskTypes

    """
    Location data
    """
    data: EditorDataInput
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
