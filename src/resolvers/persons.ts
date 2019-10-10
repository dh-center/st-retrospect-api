import { BaseTypeResolver } from '../types/graphql';

export default {
  Query: {
    person(_, { id }: { id: string }, { db }) {
      console.log(db)
      return {
        id
      };
    }
  } as BaseTypeResolver
};
