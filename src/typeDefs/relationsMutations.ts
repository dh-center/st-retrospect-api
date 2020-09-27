import { gql } from 'apollo-server-express';

export default gql`
  input CreateRelationInput {
    """
    Person ID in relation
    """
    personId: ObjectId!

    """
    Location Instance ID in relation
    """
    locationInstanceId: ObjectId!

    """
    Relation type ID
    """
    relationId: ObjectId!

    """
    Quote about relation
    """
    quote: MultilingualString! @multilingual
  }

  input UpdateRelationInput {
    """
    ID of relation for updating
    """
    id: ID!

    """
    Person ID in relation
    """
    personId: ObjectId

    """
    Location Instance ID in relation
    """
    locationInstanceId: ObjectId

    """
    Relation type ID
    """
    relationId: ObjectId

    """
    Quote about relation
    """
    quote: MultilingualString @multilingual
  }

  type CreateRelationPayload {
    """
    Created relation id
    """
    recordId: ObjectId!

    """
    Created relation
    """
    record: Relation!
  }

  type UpdateRelationPayload {
    """
    Updated relation id
    """
    recordId: ObjectId!

    """
    Updated relation
    """
    record: Relation!
  }

  type DeleteRelationPayload {
    """
    Deleted relation id
    """
    recordId: ObjectId
  }

  type RelationMutations {
    """
    Create relation
    """
    create(input: CreateRelationInput!): CreateRelationPayload! @adminCheck

    """
    Update relation
    """
    update(input: UpdateRelationInput!): UpdateRelationPayload! @adminCheck

    """
    Delete relation
    """
    delete(id: ObjectId!): DeleteRelationPayload! @adminCheck
  }

  extend type Mutation {
    relation: RelationMutations!
  }
`;
