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

  type UserMutations {
    """
    Complete quest
    """
    completeQuest(questId: GlobalId!): UserCompleteQuestPayload! @authCheck
  }

  extend type Mutation {
    user: UserMutations!
  }
`;
