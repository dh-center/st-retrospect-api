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
    name: String @multilingual

    """
    Quest description
    """
    description: String @multilingual

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
`;
