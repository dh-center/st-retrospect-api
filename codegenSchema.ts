import multilingualDirective from './src/directives/multilingual';
import paginationDirective from './src/directives/pagination';
import fromFieldDirective from './src/directives/fromField';
import authCheckDirective from './src/directives/authСheck';
import adminCheckDirective from './src/directives/adminCheck';
import editorCheckDirective from './src/directives/editorCheck';
import dataLoaderDirective from './src/directives/dataloaders';
import createDirectiveDefault from '@codexteam/graphql-directive-default';

import globalIdResolver from './src/globalIdResolver';
import toGlobalIdDirective from './src/directives/toGlobalId';

import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './src/typeDefs';

/**
 * Export scheme for GraphQL Code Generator
 */
export default makeExecutableSchema({
  typeDefs,
  schemaTransforms: [
    globalIdResolver,
    toGlobalIdDirective('toGlobalId'),
    paginationDirective('pagination'),
    multilingualDirective('multilingual'),
    fromFieldDirective('fromField'),
    authCheckDirective('authCheck'),
    adminCheckDirective('adminCheck'),
    editorCheckDirective('editorCheck'),
    dataLoaderDirective('dataLoader'),
    createDirectiveDefault().schemaTransformer,
  ],
});
