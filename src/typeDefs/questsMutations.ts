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
    Quest data
    """
    data: EditorDataInput!
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
    Updated quest id
    """
    recordId: ID!

    """
    Updated quest
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
