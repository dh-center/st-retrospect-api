import { Collection, Db, ObjectId } from 'mongodb';
import { GraphQLSchema } from 'graphql';
import DataLoaders from '../dataLoaders';
import { PersonDBScheme } from '../resolvers/persons';
import { LocationDBScheme, LocationInstanceDBScheme } from '../resolvers/locations';
import { RelationDBScheme } from '../resolvers/relations';
import { QuestDBScheme } from '../resolvers/quests';
import { RelationTypeDBScheme } from '../resolvers/relationTypes';

export type CollectionAccessFunction = <T extends keyof Collections>(name: T) => Collection<Collections[T]>

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

  /**
   * Method for accessing to database collections
   */
  readonly collection: CollectionAccessFunction;
}

/**
 * Map with collection name and its type
 */
interface Collections {
  persons: PersonDBScheme;
  locations: LocationDBScheme;
  // eslint-disable-next-line camelcase
  location_instances: LocationInstanceDBScheme;
  relations: RelationDBScheme;
  quests: QuestDBScheme;
  relationtypes: RelationTypeDBScheme;
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
export interface DeleteMutationPayload {
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

/**
 * Possible values of the type names in our API
 */
export type NodeName =
  'Person' |
  'Location' |
  'Relation' |
  'Quest' |
  'LocationInstance' |
  'User' |
  'LocationType' |
  'Address' |
  'RelationType' |
  'Route' |
  'Country' |
  'Region';
