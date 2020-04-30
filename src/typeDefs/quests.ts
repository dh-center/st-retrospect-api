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
    name: String

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

    """
    Quest task
    """
    task: JSON!

    """
    Quest rewards
    """
    rewards: [JSON!]!
  }

  input InputQuest {
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

  type QuestMutations {
    """
    Create quest
    """
    create(input: InputQuest): Quest!
  }

  extend type Mutation {
    quest: QuestMutations
  }
`;
