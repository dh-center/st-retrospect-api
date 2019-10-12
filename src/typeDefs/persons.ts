import { gql } from 'apollo-server-express';

export default gql`
  type Person {
    """
    Person's id
    """
    id: ID!

    """
    Person's first name
    """
    firstName: JSON

    """
    Person's last name
    """
    lastName: JSON

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
  }

  extend type Query {
    """
    Get specific person
    """
    person(
      "Project id"
      id: ID!,

      "language in which to return data"
      languages: [Languages!]!
    ): Person

    """
    Get all persons
    """
    persons(
      "language in which to return data"
      languages: [Languages!]!
    ): [Person!]!
  }
`;
