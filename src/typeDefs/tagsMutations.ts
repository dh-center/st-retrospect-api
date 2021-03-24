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

  input UpdateTagInput {
    """
    Tag id for updating
    """
    id: GlobalId!

    """
    New tag value
    """
    value: MultilingualString! @multilingual
  }

  type UpdateTagPayload {
    """
    Updated tag id
    """
    recordId: GlobalId! @toGlobalId(type: "Tag")

    """
    Updated tag object
    """
    record: Tag!
  }

  type DeleteTagPayload {
    """
    Deleted tag id
    """
    recordId: GlobalId! @toGlobalId(type: "Tag")
  }

  type TagMutations {
    """
    Creates tag
    """
    create(input: CreateTagInput!): CreateTagPayload! @editorCheck

    """
    Updates existing tag
    """
    update(input: UpdateTagInput!): UpdateTagPayload! @editorCheck

    """
    Deletes existing tag
    """
    delete(id: GlobalId!): DeleteTagPayload! @editorCheck
  }

  extend type Mutation {
    tag: TagMutations!
  }
`;
