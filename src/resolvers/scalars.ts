import { ObjectIDResolver } from 'graphql-scalars';
import { GraphQLString } from 'graphql';

export default {
  ObjectId: ObjectIDResolver,
  MultilingualString: GraphQLString,
};
