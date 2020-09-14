import { GraphQLString } from 'graphql';

const MultilingualString = {
  ...GraphQLString,
  name: 'MultilingualString',
};

export default MultilingualString;
