import { gql } from 'apollo-server-express';

export default gql`
  """
  Location style
  """
  type LocationStyle implements Node {
    """
    LoactionStyle ID
    """
    id: ID! @fromField(name: "_id")

    """
    LocationStyle name
    """
    name: String @multilingual
  }

  """
  Input for create mutation
  """
  input CreateLocationStyleInput {
    name: MultilingualString! @multilingual
  }

  """
  Payload of create mutation response
  """
  type CreateLocationStylePayload {
    """
    New record id
    """
    recordId: GlobalId! @toGlobalId(type: "LocationStyle")

    """
    Location style object
    """
    record: LocationStyle!
  }

  """
  Input for update mutation
  """
  input UpdateLocationStyleInput {
    """
    Location style id
    """
    id: GlobalId!

    """
    Location style name
    """
    name: MultilingualString! @multilingual
  }

  """
  Payload of update mutation
  """
  type UpdateLocationStylePayload {
    """
    Updated record id
    """
    recordId: GlobalId! @toGlobalId(type: "LocationStyle")

    """
    Location style object
    """
    record: LocationStyle!
  }

  """
  Payload of delete mutation
  """
  type DeleteLocationStylePayload {
    """
    Deleted record id
    """
    recordId: GlobalId! @toGlobalId(type: "LocationStyle")
  }

  """
  Location style mutations
  """
  type LocationStyleMutations {
    """
    Creates new location style
    """
    create(input: CreateLocationStyleInput!): CreateLocationStylePayload! @adminCheck

    """
    Updates existed location style
    """
    update(input: UpdateLocationStyleInput!): UpdateLocationStylePayload! @adminCheck

    """
    Deletes location style by id
    """
    delete(id: GlobalId!): DeleteLocationStylePayload! @adminCheck
  }

  extend type Mutation {
    locationStyles: LocationStyleMutations!
  }
`;
