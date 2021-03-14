import multilingualDirective from './directives/multilingual';
import paginationDirective from './directives/pagination';
import fromFieldDirective from './directives/fromField';
import authCheckDirective from './directives/authСheck';
import adminCheckDirective from './directives/adminCheck';
import dataLoaderDirective from './directives/dataloaders';
import createDirectiveDefault from '@codexteam/graphql-directive-default';

import globalIdResolver from './globalIdResolver';
import toGlobalIdDirective from './directives/toGlobalId';

import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

export default makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaTransforms: [
    globalIdResolver,
    toGlobalIdDirective('toGlobalId'),
    paginationDirective('pagination'),
    multilingualDirective('multilingual'),
    fromFieldDirective('fromField'),
    authCheckDirective('authCheck'),
    adminCheckDirective('adminCheck'),
    dataLoaderDirective('dataLoader'),
    createDirectiveDefault().schemaTransformer,
  ],
});
