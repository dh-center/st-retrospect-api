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
    relations: [Relation!]!

    """
    Person main photo
    """
    mainPhotoLink: String

    """
    Person's photos links
    """
    photoLinks: [String]
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
    persons: [Person!]!
  }
`;
