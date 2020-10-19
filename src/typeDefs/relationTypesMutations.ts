import { gql } from 'apollo-server-express';

export default gql`
  input CreateRelationTypeInput {
    """
    Relation type name
    """
    name: String! @multilingual

    """
    Relation type synonyms
    """
    synonyms: [String!]! @multilingual
  }

  type CreateRelationTypePayload {
    """
    Created relation type id
    """
    recordId: GlobalId! @toGlobalId(type: "RelationType")

    """
    Created relation type
    """
    record: RelationType!
  }

  type RelationTypeMutations {
    """
    Creates relation type
    """
    create(input: CreateRelationTypeInput!): CreateRelationTypePayload @adminCheck
  }
`;
