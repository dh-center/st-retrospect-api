import { gql } from 'apollo-server-express';

export default gql`
  """
  Data saved from Editor.js
  See https://editorjs.io/saving-data
  """
  type EditorData {
    """
    Saving timestamp
    """
    time : Int!

    """
    List of Blocks data
    """
    blocks : [JSON!]!

    """
    Version of Editor.js
    """
    version : String!
  }

  input EditorDataInput {
    """
    Saving timestamp
    """
    time : Int!

    """
    List of Blocks data
    """
    blocks : [JSON!]!

    """
    Version of Editor.js
    """
    version : String!
  }


  type Quest {
    """
    Quest ID
    """
    id: ID! @fromField(name: "_id")

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
    Quest data
    """
    data: EditorData

    """
    Quest rewards
    """
    rewards: [JSON!]!
  }

  """
  Model for representing list of quests
  """
  type QuestConnection {
    """
    List of quests edges
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

  """
  Information about specific quest in connection
  """
  type QuestEdge {
    """
    Cursor of this quest
    """
    cursor: Cursor!

    """
    Quest info
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
    type: TaskTypes! = ROUTE

    """
    Quest data
    """
    data: EditorDataInput!
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

      "Number of requested nodes after a node with a cursor in the after argument"
      first: Int,

      "Number of requested nodes before a node with a cursor in the before argument"
      last: Int
    ): QuestConnection! @pagination(collectionName: "quests")
  }

  type CreateQuestPayload {
    """
    Created quest id
    """
    recordId: ID!

    """
    Created quest
    """
    record: Quest!
  }

  input UpdateQuestInput {
    """
    Quest ID
    """
    id: ID!

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
    type: TaskTypes

    """
    Quest data
    """
    data: EditorDataInput
  }

  type UpdateQuestPayload {
    """
    Created quest id
    """
    recordId: ID!

    """
    Created quest
    """
    record: Quest!
  }

  type DeleteQuestPayload {
    """
    Deleted quest id
    """
    recordId: ID!
  }

  type QuestMutations {
    """
    Create quest
    """
    create(input: CreateQuestInput!): CreateQuestPayload! @adminCheck

    """
    Update quest
    """
    update(input: UpdateQuestInput!): UpdateQuestPayload! @adminCheck

    """
    Delete quest
    """
    delete(id: ID!): DeleteQuestPayload! @adminCheck
  }

  extend type Mutation {
    quest: QuestMutations!
  }
`;
