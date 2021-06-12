import { GraphQLScalarType } from 'graphql';
import { ObjectId } from 'mongodb';
import { fromGlobalId } from '../../utils/globalId';

const GlobalId = new GraphQLScalarType({
  name: 'GlobalId',
  parseValue(value): ObjectId {
    if (!value) {
      throw new Error('Not valid ObjectId');
    }

    return new ObjectId(fromGlobalId(value).id);
  },
});

export default GlobalId;
