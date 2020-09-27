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
    quote: MultilingualString!
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
    Delete relation
    """
    delete(id: ObjectId!): DeleteRelationPayload! @adminCheck
  }

  extend type Mutation {
    relation: RelationMutations!
  }
`;
