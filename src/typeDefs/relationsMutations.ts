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
    quote: MultilingualString
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
    quote: MultilingualString
  }

  type CreateRelationPayload {
    """
    Created relation id
    """
    recordId: ID

    """
    Created relation
    """
    record: Relation
  }

  type UpdateRelationPayload {
    """
    Updated relation id
    """
    recordId: ID

    """
    Updated relation
    """
    record: Relation
  }

  type DeleteRelationPayload {
    """
    Deleted relation id
    """
    recordId: ID
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
    delete(id: ID!): DeleteRelationPayload! @adminCheck
  }

  extend type Mutation {
    relation: RelationMutations
  }
`;
