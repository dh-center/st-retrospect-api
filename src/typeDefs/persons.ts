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
    firstName: JSON

    """
    Person's last name
    """
    lastName: JSON

    """
    Person's patronymic
    """
    patronymic: JSON

    """
    Person's pseudonym
    """
    pseudonym: JSON

    """
    Person's profession
    """
    profession: JSON

    """
    Person's description
    """
    description: JSON

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
