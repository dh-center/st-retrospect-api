import { gql } from 'apollo-server-express';

export default gql`
  type Person {
    """
    Person's id
    """
    id: ID! @renameField(name: "_id")

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
      after: Cursor,
      before: Cursor,
      first: Int,
      last: Int
    ): PersonConnection!
  }
`;
