import { gql } from 'apollo-server-express';

export default gql`
  type Person implements Node {
    """
    Person's id
    """
    id: ID! @fromField(name: "_id")

    """
    Person's first name
    """
    firstName: MultilingualString @multilingual

    """
    Person's last name
    """
    lastName: MultilingualString @multilingual

    """
    Person's patronymic
    """
    patronymic: MultilingualString @multilingual

    """
    Person's pseudonym
    """
    pseudonym: MultilingualString @multilingual

    """
    Person's professions
    """
    professions: [String!] @multilingual

    """
    Person's description
    """
    description: MultilingualString @multilingual

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
    Link with photo for card
    """
    cardPhotoLink: String

    """
    Person's photos links
    """
    photoLinks: [String!]

    """
    Person tags
    """
    tags: [Tag!]! @dataLoader(dataLoaderName: "tagById", fieldName: "tagIds") @default(value: "[]")
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
      "Person id"
      id: GlobalId!
    ): Person @dataLoader(dataLoaderName: "personById", argName: "id")

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

    personsCards: [Person!]! @default(value: "[]")
  }

  input CreatePersonInput {
    """
    Person's last name
    """
    lastName: MultilingualString @multilingual

    """
    Person's first name
    """
    firstName: MultilingualString @multilingual

    """
    Person's patronymic
    """
    patronymic: MultilingualString @multilingual

    """
    Person's pseudonym
    """
    pseudonym: MultilingualString @multilingual

    """
    Link with main photo
    """
    mainPhotoLink: String

    """
    Link with photo for card
    """
    cardPhotoLink: String

    """
    Person's professions
    """
    professions: [String!] @multilingual

    """
    Person's description
    """
    description: MultilingualString @multilingual

    """
    Person's birth date
    """
    birthDate: String

    """
    Person's death date
    """
    deathDate: String

    """
    Contains links with person's photos
    """
    photoLinks: [String!]

    """
    Person's info link
    """
    wikiLink: String

    """
    Person tags
    """
    tagIds: [GlobalId!]!
  }

  type CreatePersonPayload {
    """
    Created person id
    """
    recordId: GlobalId! @toGlobalId(type: "Person")

    """
    Created person
    """
    record: Person!
  }

  input UpdatePersonInput {
    """
    ID of person for updating
    """
    id: GlobalId!

    """
    Person's last name
    """
    lastName: String @multilingual

    """
    Person's first name
    """
    firstName: String @multilingual

    """
    Person's patronymic
    """
    patronymic: String @multilingual

    """
    Person's pseudonym
    """
    pseudonym: String @multilingual

    """
    Link with main photo
    """
    mainPhotoLink: String

    """
    Link with photo for card
    """
    cardPhotoLink: String

    """
    Person's professions
    """
    professions: [String!] @multilingual

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
    Contains links with person's photos
    """
    photoLinks: [String!]

    """
    Person's info link
    """
    wikiLink: String

    """
    Person tags
    """
    tagIds: [GlobalId!]!
  }

  type UpdatePersonPayload {
    """
    Updated person id
    """
    recordId: GlobalId! @toGlobalId(type: "Person")

    """
    Updated person
    """
    record: Person!
  }

  type DeletePersonPayload {
    """
    Deleted person id
    """
    recordId: GlobalId! @toGlobalId(type: "Person")
  }

  type PersonMutations {
    """
    Create person
    """
    create(input: CreatePersonInput!): CreatePersonPayload! @editorCheck

    """
    Update person
    """
    update(input: UpdatePersonInput!): UpdatePersonPayload! @editorCheck

    """
    Delete person
    """
    delete(id: GlobalId!): DeletePersonPayload! @editorCheck
  }

  extend type Mutation {
    person: PersonMutations
  }
`;
