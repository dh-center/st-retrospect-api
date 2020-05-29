import { Db, ObjectId } from 'mongodb';
import { GraphQLSchema } from 'graphql';
import DataLoaders from '../dataLoaders';

/**
 * Resolver's Context argument
 */
export interface ResolverContextBase {
  /**
   * MongoDB connection to make queries
   */
  readonly db: Db;
  /**
   * Accept languages
   */
  readonly languages: Languages[];
  /**
   * User's access token
   */
  readonly user: AccessTokenData;

  /**
   * DataLoaders for data fetching
   */
  readonly dataLoaders: DataLoaders;
}

/**
 * Object storing strings in different languages
 */
export interface MultilingualString {
  [key: string]: string;
}

/**
 * Supported languages for data
 */
export enum Languages {
  RU = 'RU',
  EN = 'EN'
}

/**
 * Point coordinates
 */
export interface PointCoordinates {
  longitude: number;
  latitude: number;
}

/**
 * Response type for mutations that creates entities
 */
export interface CreateMutationPayload<T> {
  /**
   * id of created record
   */
  recordId: ObjectId;

  /**
   * created record
   */
  record: T;
}

/**
 * Response type for mutations that updates entities
 */
export interface UpdateMutationPayload<T> {
  /**
   * Id of updated record
   */
  recordId: ObjectId;

  /**
   * Updated record
   */
  record: T;
}

/**
 * Response type for mutations that deletes entities
 */
export interface DeleteMutationPayload<T> {
  /**
   * Id of deleted record
   */
  recordId: ObjectId;
}

/**
 * User access token
 */
export interface AccessTokenData {
  id: string;
  isAdmin: boolean;
}

/**
 * Common return type for directives
 */
export type DirectiveTransformer = (schema: GraphQLSchema) => GraphQLSchema;
