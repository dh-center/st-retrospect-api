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
  }

  extend type Mutation {
    """
    Mutations for users
    """
    user: UserMutations!
  }
`;
