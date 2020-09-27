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
    recordId: ID!

    """
    Created relation
    """
    record: Relation!
  }

  type RelationMutations {
    """
    Create relation
    """
    create(input: CreateRelationInput!): CreateRelationPayload! @adminCheck
  }

  extend type Mutation {
    relation: RelationMutations!
  }
`;
