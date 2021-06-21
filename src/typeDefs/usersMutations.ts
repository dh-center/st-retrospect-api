import { gql } from 'apollo-server-express';

export default gql`
  """
  Input for updating users permissions
  """
  input UpdateUserPermissionsInput {
    """
    Id of the user to update
    """
    id: GlobalId!

    """
    New persmissions
    """
    permissions: [String!]!
  }

  """
  Payload that returns after updating user data
  """
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
  Input for updating user attributes
  """
  input UpdateUserInput {
    """
    New username
    """
    username: String

    """
    New user profile photo
    """
    photo: String
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
    completeQuest(questId: GlobalId!): UpdateUserPayload! @authCheck

    """
    Updates user permissions
    """
    setPermissions(input: UpdateUserPermissionsInput!): UpdateUserPayload! @adminCheck

    """
    Changes User attributes
    """
    update(input: UpdateUserInput!): UpdateUserPayload! @authCheck

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
