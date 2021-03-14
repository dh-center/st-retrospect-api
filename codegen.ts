import schemaString from './src/typeDefs';
import { buildSchema } from 'graphql';

export default buildSchema(schemaString);
