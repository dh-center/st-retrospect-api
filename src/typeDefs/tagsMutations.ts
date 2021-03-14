import { gql } from 'apollo-server-express';

export default gql`
  input CreateTagInput {
    """
    Value of tag
    """
    value: MultilingualString! @multilingual
  }

  type CreateTagPayload {
    """
    Created tag id
    """
    recordId: GlobalId! @toGlobalId(type: "Tag")

    """
    Created tag object
    """
    record: Tag!
  }

  type TagMutations {
    """
    Creates tag
    """
    create(input: CreateTagInput!): CreateTagPayload! @adminCheck
  }

  extend type Mutation {
    tag: TagMutations!
  }
`;
