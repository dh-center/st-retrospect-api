import { gql } from 'apollo-server-express';

/**
 * Custom scalars from https://github.com/Urigo/graphql-scalars
 */
export default gql`
  scalar Long

  scalar JSON

  scalar Timestamp
`;
