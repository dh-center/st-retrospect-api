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

  type QuestConnection {
    """
    List of persons edges
    """
    edges: [QuestEdge!]!

    """
    Information about this page
    """
    pageInfo: PageInfo!

    """
    Number of available edges
    """
    totalCount: Int!
  }

  type QuestEdge {
    """
    Cursor of this person
    """
    cursor: Cursor!

    """
    Person info
    """
    node: Quest!
  }

  """
  Possible task types
  """
  enum TaskTypes {
    """
    Task type quiz
    """
    QUIZ

    """
    Task type route
    """
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
    type: TaskTypes!
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
    quests(
      "The cursor after which we take the data"
      after: Cursor,

      "The cursor after before we take the data"
      before: Cursor,

      "The number of requested objects from the beginning of the list"
      first: Int,

      "The number of requested objects from the eng of the list"
      last: Int
    ): QuestConnection! @pagination(collectionName: "quests")
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
