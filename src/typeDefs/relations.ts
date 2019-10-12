import { gql } from 'apollo-server-express';

export default gql`
  type Relation {
    person: Person!
    location: Location!
    relationType: String!
  }
`;
