import { gql } from 'apollo-server-express';

export default gql`
  type UserCompleteQuestPayload {
    """
    User id
    """
    recordId: GlobalId! @toGlobalId(type: "User")

    """
    User completed quest
    """
    record: User!
  }

  input UpdateUserInput {
    """
    Id of the user to update
    """
    id: GlobalId!

    """
    New persmissions
    """
    permissions: [String!]!
  }

  type UpdateUserPayload {
    """
    Updated user id
    """
    recordId: GlobalId! @toGlobalId(type: "User")

    """
    Updated user
    """
    record: User!
  }

  """
  Mutations for users
  """
  type UserMutations {
    """
    Complete quest
    """
    completeQuest(questId: GlobalId!): UserCompleteQuestPayload! @authCheck

    """
    Updates user data
    """
    update(input: UpdateUserInput!): UpdateUserPayload! @adminCheck

    """
    Send friend request to user by user id
    """
    sendFriendRequest(id: GlobalId!): UpdateUserPayload! @authCheck

    """
    Cancel dispatched friend request
    """
    cancelFriendRequest(id: GlobalId!): UpdateUserPayload! @authCheck

    """
    Accept received friend request
    """
    acceptFriendRequest(id: GlobalId!): UpdateUserPayload! @authCheck

    """
    Reject received friend request
    """
    rejectFriendRequest(id: GlobalId!): UpdateUserPayload! @authCheck
  }

  extend type Mutation {
    """
    Mutations for users
    """
    user: UserMutations!
  }
`;
