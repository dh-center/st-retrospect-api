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
    instances: [CreateLocationInstanceInput!]!
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
