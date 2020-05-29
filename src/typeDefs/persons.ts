import { gql } from 'apollo-server-express';

export default gql`
  type Person {
    """
    Person's id
    """
    id: ID! @fromField(name: "_id")

    """
    Person's first name
    """
    firstName: String @multilingual

    """
    Person's last name
    """
    lastName: String @multilingual

    """
    Person's patronymic
    """
    patronymic: String @multilingual

    """
    Person's pseudonym
    """
    pseudonym: String @multilingual

    """
    Person's profession
    """
    profession: String @multilingual

    """
    Person's description
    """
    description: String @multilingual

    """
    Person's birth date
    """
    birthDate: String

    """
    Person's death date
    """
    deathDate: String

    """
    Person relations
    """
    relations: [Relation!]! @dataLoader(dataLoaderName: "relationByPersonId", fieldName: "_id")

    """
    Person's info link
    """
    wikiLink: String

    """
    Person's main photo
    """
    mainPhotoLink: String

    """
    Person's photos links
    """
    photoLinks: [String]
  }

  """
  Model for representing list of persons
  """
  type PersonConnection {
    """
    List of persons edges
    """
    edges: [PersonEdge!]!

    """
    Information about this page
    """
    pageInfo: PageInfo!

    """
    Number of available edges
    """
    totalCount: Int!
  }

  """
  Information about specific person in connection
  """
  type PersonEdge {
    """
    Cursor of this person
    """
    cursor: Cursor!

    """
    Person info
    """
    node: Person!
  }

  """
  Information about current page
  """
  type PageInfo {
    """
    Information about the existence of the next page
    """
    hasNextPage: Boolean!

    """
    Information about the existence of the previous page
    """
    hasPreviousPage: Boolean!

    """
    First cursor on this page
    """
    startCursor: Cursor

    """
    Last cursor on this page
    """
    endCursor: Cursor
  }

  extend type Query {
    """
    Get specific person
    """
    person(
      "Project id"
      id: ID!
    ): Person

    """
    Get all persons
    """
    persons(
      "The cursor after which we take the data"
      after: Cursor,

      "The cursor after before we take the data"
      before: Cursor,

      "Number of requested nodes after a node with a cursor in the after argument"
      first: Int,

      "Number of requested nodes before a node with a cursor in the before argument"
      last: Int
    ): PersonConnection! @pagination(collectionName: "persons")
  }

  input CreatePersonInput {
    """
    Person's first name
    """
    firstName: String @multilingual

    """
    Person's last name
    """
    lastName: String @multilingual

    """
    Person's patronymic
    """
    patronymic: String @multilingual

    """
    Person's pseudonym
    """
    pseudonym: String @multilingual

    """
    Person's profession
    """
    profession: String @multilingual

    """
    Person's description
    """
    description: String @multilingual

    """
    Person's birth date
    """
    birthDate: String

    """
    Person's death date
    """
    deathDate: String

    """
    Person's info link
    """
    wikiLink: String
  }

  type CreatePersonPayload {
    """
    Created person id
    """
    recordId: ID

    """
    Created person
    """
    record: Person
  }

  input UpdatePersonInput {
    """
    ID of person for updating
    """
    id: ID!

    """
    Person's first name
    """
    firstName: String @multilingual

    """
    Person's last name
    """
    lastName: String @multilingual

    """
    Person's patronymic
    """
    patronymic: String @multilingual

    """
    Person's pseudonym
    """
    pseudonym: String @multilingual

    """
    Person's profession
    """
    profession: String @multilingual

    """
    Person's description
    """
    description: String @multilingual

    """
    Person's birth date
    """
    birthDate: String

    """
    Person's death date
    """
    deathDate: String

    """
    Person's info link
    """
    wikiLink: String
  }

  type UpdatePersonPayload {
    """
    Updated person id
    """
    recordId: ID

    """
    Updated person
    """
    record: Person
  }

  type DeletePersonPayload {
    """
    Deleted person id
    """
    recordId: ID
  }

  type PersonMutations {
    """
    Create person
    """
    create(input: CreatePersonInput!): CreatePersonPayload! @adminCheck

    """
    Update person
    """
    update(input: UpdatePersonInput!): UpdatePersonPayload! @adminCheck

    """
    """
    delete(id: ID!): DeletePersonPayload! @adminCheck
  }

  extend type Mutation {
    person: PersonMutations
  }
`;
