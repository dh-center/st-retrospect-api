import { gql } from 'apollo-server-express';

export default gql`
  type Quest {
    """
    Quest ID
    """
    id: ID! @renameField(name: "_id")

    """
    Quest name
    """
    name: String!

    """
    Quest description
    """
    description: String

    """
    Quest photo
    """
    photo: String

    """
    Quest type (quiz, route, etc.)
    """
    type: TaskTypes!

    """
    Quest task
    """
    task: JSON!

    """
    Quest rewards
    """
    rewards: [JSON!]!
  }

  enum TaskTypes {
    QUIZ
    ROUTE
  }

  input CreateQuestInput {
    """
    Quest name
    """
    name: String!

    """
    Quest description
    """
    description: String

    """
    Quest photo
    """
    photo: String

    """
    Quest type (quiz, route, etc.)
    """
    type: String!
  }

  extend type Query {
    """
    Get specific Quest
    """
    quest(
      "Quest id"
      id: ID!
    ): Quest

    """
    Get all quests
    """
    quests: [Quest!]!
  }

  type CreateQuestPayload {
    """
    Created quest id
    """
    questId: ID

    """
    Created quest
    """
    quest: Quest
  }

  type QuestMutations {
    """
    Create quest
    """
    create(input: CreateQuestInput): CreateQuestPayload!
  }

  extend type Mutation {
    quest: QuestMutations
  }
`;
