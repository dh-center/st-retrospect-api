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
  Input to resetting user password
  """
  input ResetPasswordInput {
    """
    Email of the user who wants reset password
    """
    email: String!

    """
    One-time code from email
    """
    code: String!

    """
    New password to set
    """
    newPassword: String!
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
    Changes username of the user
    """
    changeUsername(username: String!): UpdateUserPayload! @authCheck

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

    """
    Remove user from friends
    """
    removeFromFriends(id: GlobalId!): UpdateUserPayload! @authCheck

    """
    Sends one-time code to user email for password resetting
    """
    sendCodeForPasswordReset(email: String!): Boolean!

    """
    Resets user password
    """
    resetPassword(input: ResetPasswordInput!): UpdateUserPayload!
  }

  extend type Mutation {
    """
    Mutations for users
    """
    user: UserMutations!
  }
`;
