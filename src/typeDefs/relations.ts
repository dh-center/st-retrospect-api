import { gql } from 'apollo-server-express';

export default gql`
  type Relation {
    id: ID!
    person: Person
    location: Location
    relationType: String,
    quote: JSON
  }
`;
