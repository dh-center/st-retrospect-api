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
    time : Timestamp

    """
    List of Blocks data
    """
    blocks : [JSON!]!

    """
    Version of Editor.js
    """
    version : String
  }

  """
  Data saved from Editor.js
  See https://editorjs.io/saving-data
  """
  input EditorDataInput {
    """
    Saving timestamp
    """
    time : Timestamp

    """
    List of Blocks data
    """
    blocks : [JSON!]!

    """
    Version of Editor.js
    """
    version : String
  }


  type Quest implements Node {
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
    Information about quest authors
    """
    credits: EditorData

    """
    Quest rewards
    """
    rewards: [JSON!]!

    """
    The minimum level required by the user to complete this quest
    """
    minLevel: Int! @default(value: "0")

    """
    The experience that the user will receive by completing this quest
    """
    earnedExp: Int! @default(value: "0")

    """
    Quest progress states (passed, available, blocked)
    """
    questProgressState: QuestUserProgressStates! @authCheck
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

  """
  Possible quest states
  """
  enum QuestUserProgressStates {
    """
    Quest is passed
    """
    PASSED

    """
    Quest is available
    """
    AVAILABLE

    """
    Quest is locked
    """
    LOCKED
  }

  extend type Query {
    """
    Get specific Quest
    """
    quest(
      "Quest id"
      id: GlobalId!
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
`;
