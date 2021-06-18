import { gql } from 'apollo-server-express';

export default gql`
  """
  Unit of measure in which the value is calculated
  """
  enum AchievementUnits {
    """
    Distance unit, for example, kilometrs
    """
    DISTANCE

    """
    Quantity unit, for example, number of passed quests
    """
    QUANTITY
  }


  """
  An achievement that a user can get for completing a quest
  """
  type Achievement implements Node {
    """
    Achievement identifier
    """
    id: ID! @fromField(name: "_id")

    """
    Achievement name
    """
    name: String! @multilingual

    """
    Unit of measure in which the value is calculated
    """
    unit: AchievementUnits!

    """
    Current value reached by the user
    """
    currentValue: Float!

    """
    The value you need to get the achievement
    """
    requiredValue: Float!
  }

  extend type Query {
    """
    List of all achievements
    """
    achievements: [Achievement!]! @default(value: "[]")
  }
`;
