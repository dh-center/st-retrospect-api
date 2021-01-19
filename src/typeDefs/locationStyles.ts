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
  Location style mutations
  """
  type LocationStyleMutations {
    """
    Creates new location style
    """
    create(input: CreateLocationStyleInput!): CreateLocationStylePayload! @adminCheck
  }

  extend type Mutation {
    locationStyles: LocationStyleMutations!
  }
`;
