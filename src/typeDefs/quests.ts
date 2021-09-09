import { gql } from 'apollo-server-express';

export default gql`
  """
  Types of applications where quest will be displayed
  """
  enum Application {
    """
    Que.St application
    """
    MOBILE

    """
    St.Retrospect application
    """
    WEB
  }

  """
  What user needs to use for route passing
  """
  enum WayToTravel {
    """
    Uses his feets
    """
    ON_FOOT

    """
    Uses scooter or bycicle
    """
    WITH_TRANSPORT
  }

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
    Quest content languange
    """
    language: Languages! @default(value: "RU")

    """
    What user needs to use for route passing
    """
    wayToTravel: WayToTravel! @default(value: "ON_FOOT")

    """
    Where quest will be displayed
    """
    whereDisplays: [Application!]! @default(value: "[]")

    """
    Quest duration in minutes
    """
    durationInMinutes: Int! @default(value: "1")

    """
    Quest distance in kilometers
    """
    distanceInKilometers: Float! @default(value: "1")

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
    Cards that user will get after quest passing
    """
    personsCards: [Person!]! @dataLoader(dataLoaderName: "personById", fieldName: "personsCardsIds") @default(value: "[]")

    """
    Achievements that the user can get after completing the quest
    """
    linkedAchievements: [Achievement!]! @dataLoader(dataLoaderName: "achievementById", fieldName: "linkedAchievementsIds") @default(value: "[]")

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
    questProgressState: QuestUserProgressStates!

    """
    Quest tags
    """
    tags: [Tag!]! @dataLoader(dataLoaderName: "tagById", fieldName: "tagIds") @default(value: "[]")

    """
    Location instances that are present in the quest
    """
    locationInstances: [LocationInstance!]!

    """
    The likelihood that the user will like this quest (rating based on a recommendation system)
    """
    recommendationScore: Float! @authCheck @default(value: "0")
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

    """
    Story about something without quiz parts
    """
    STORY

    """
    Quest is a route with tests
    """
    QUEST
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

      """
      Filter query results
      """
      filter: JSON
    ): QuestConnection! @pagination(collectionName: "quests")
  }
`;
