import { gql } from 'apollo-server-express';

export default gql`
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
    The minimum level required by the user to complete this quest
    """
    minLevel: Int!

    """
    The experience that the user will receive by completing this quest
    """
    earnedExp: Int!

    """
    Quest data
    """
    data: EditorDataInput!

    """
    Information about quest authors
    """
    credits: EditorDataInput!

    """
    Quest tags
    """
    tagIds: [String!]!
  }

  type CreateQuestPayload {
    """
    Created quest id
    """
    recordId: GlobalId! @toGlobalId(type: "Quest")

    """
    Created quest
    """
    record: Quest!
  }

  input UpdateQuestInput {
    """
    Quest ID
    """
    id: GlobalId!

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
    The minimum level required by the user to complete this quest
    """
    minLevel: Int

    """
    The experience that the user will receive by completing this quest
    """
    earnedExp: Int

    """
    Quest data
    """
    data: EditorDataInput

    """
    Information about quest authors
    """
    credits: EditorDataInput

    """
    Quest tags
    """
    tagIds: [String!]
  }

  type UpdateQuestPayload {
    """
    Updated quest id
    """
    recordId: GlobalId! @toGlobalId(type: "Quest")

    """
    Updated quest
    """
    record: Quest!
  }

  type DeleteQuestPayload {
    """
    Deleted quest id
    """
    recordId: GlobalId! @toGlobalId(type: "Quest")
  }

  type QuestMutations {
    """
    Create quest
    """
    create(input: CreateQuestInput!): CreateQuestPayload! @editorCheck

    """
    Update quest
    """
    update(input: UpdateQuestInput!): UpdateQuestPayload! @editorCheck

    """
    Delete quest
    """
    delete(id: GlobalId!): DeleteQuestPayload! @editorCheck
  }

  extend type Mutation {
    quest: QuestMutations!
  }
`;
