import { gql } from 'apollo-server-express';

export default gql`
  input CreateRelationInput {
    """
    Person ID in relation
    """
    personId: GlobalId!

    """
    Location Instance ID in relation
    """
    locationInstanceId: GlobalId!

    """
    Relation type ID
    """
    relationId: GlobalId!

    """
    Quote about relation
    """
    quote: MultilingualString! @multilingual

    """
    Link to quote
    """
    link: MultilingualString! @multilingual

    """
    Date of relation start
    """
    startDate: String!

    """
    Date of relation end
    """
    endDate: String!
  }

  input UpdateRelationInput {
    """
    ID of relation for updating
    """
    id: GlobalId!

    """
    Person ID in relation
    """
    personId: GlobalId

    """
    Location Instance ID in relation
    """
    locationInstanceId: GlobalId

    """
    Relation type ID
    """
    relationId: GlobalId

    """
    Quote about relation
    """
    quote: MultilingualString @multilingual

    """
    Link to quote
    """
    link: MultilingualString @multilingual

    """
    Date of relation start
    """
    startDate: String

    """
    Date of relation end
    """
    endDate: String
  }

  type CreateRelationPayload {
    """
    Created relation id
    """
    recordId: GlobalId! @toGlobalId(type: "Relation")

    """
    Created relation
    """
    record: Relation!
  }

  type UpdateRelationPayload {
    """
    Updated relation id
    """
    recordId: GlobalId! @toGlobalId(type: "Relation")

    """
    Updated relation
    """
    record: Relation!
  }

  type DeleteRelationPayload {
    """
    Deleted relation id
    """
    recordId: GlobalId! @toGlobalId(type: "Relation")
  }

  type RelationMutations {
    """
    Create relation
    """
    create(input: CreateRelationInput!): CreateRelationPayload! @editorCheck

    """
    Update relation
    """
    update(input: UpdateRelationInput!): UpdateRelationPayload! @editorCheck

    """
    Delete relation
    """
    delete(id: GlobalId!): DeleteRelationPayload! @editorCheck
  }

  extend type Mutation {
    relation: RelationMutations!
  }
`;
