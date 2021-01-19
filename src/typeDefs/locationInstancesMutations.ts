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
    Location style id
    """
    locationStyleId: GlobalId

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

    """
    Source of information about location instance
    """
    source: MultilingualString! @multilingual
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
    Location style id
    """
    locationStyleId: GlobalId

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
    Source of information about location instance
    """
    source: MultilingualString! @multilingual
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

  input AddArchitectInput {
    """
    Location instance id
    """
    locationInstanceId: GlobalId!

    """
    Architect for adding
    """
    architectId: GlobalId!
  }

  type AddArchitectPayload {
    """
    New relation id
    """
    recordId: GlobalId! @toGlobalId(type: "Relation")

    """
    New relation
    """
    record: Relation!
  }

  input RemoveArchitectInput {
    """
    Location instance id
    """
    locationInstanceId: GlobalId!

    """
    Architect for removing
    """
    architectId: GlobalId!
  }

  type RemoveArchitectPayload {
    """
    Deleted relation id
    """
    recordId: GlobalId! @toGlobalId(type: "Relation")
  }

  type LocationInstanceMutations {
    """
    Create location instance
    """
    create(input: CreateLocationInstanceInput!): CreateLocationInstancePayload! @adminCheck

    """
    Add architect to location instance
    """
    addArchitect(input: AddArchitectInput!): AddArchitectPayload! @adminCheck

    """
    Remove architects from location instance
    """
    removeArchitect(input: RemoveArchitectInput!): RemoveArchitectPayload! @adminCheck

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
