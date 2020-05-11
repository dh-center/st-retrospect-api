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

      "The number of requested objects from the beginning of the list"
      first: Int,

      "The number of requested objects from the eng of the list"
      last: Int
    ): PersonConnection! @pagination(collectionName: "persons")
  }
`;
