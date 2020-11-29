import { gql } from 'apollo-server-express';

export default gql`
  input CreateRelationTypeInput {
    """
    Relation type name
    """
    name: MultilingualString! @multilingual

    """
    Relation type synonyms
    """
    synonyms: [MultilingualString]!
  }

  input UpdateRelationTypeInput {
    """
    ID of relation type for updating
    """
    id: GlobalId!

    """
    Relation type name
    """
    name: MultilingualString @multilingual

    """
    Relation type synonyms
    """
    synonyms: [MultilingualString]
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

  type UpdateRelationTypePayload {
    """
    Updated relation type id
    """
    recordId: GlobalId! @toGlobalId(type: "RelationType")

    """
    Updated relation type
    """
    record: RelationType!
  }

  type DeleteRelationTypePayload {
    """
    Deleted relation type id
    """
    recordId: GlobalId! @toGlobalId(type: "RelationType")
  }

  type RelationTypeMutations {
    """
    Creates relation type
    """
    create(input: CreateRelationTypeInput!): CreateRelationTypePayload! @adminCheck

    """
    Update relation type
    """
    update(input: UpdateRelationTypeInput!): UpdateRelationTypePayload! @adminCheck

    """
    Delete relation type
    """
    delete(id: GlobalId!): DeleteRelationTypePayload! @adminCheck
  }

  extend type Mutation {
    relationType: RelationTypeMutations!
  }
`;
