/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Cursor: string;
  /** A field whose value conforms with the standard mongodb object ID as described here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c */
  ObjectId: import('mongodb').ObjectId;
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  MultilingualString: import('../types/graphql').MultilingualString;
  GlobalId: import('mongodb').ObjectId;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  Long: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
};

/** An object with a Globally Unique ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};





/** Supported languages for data */
export enum Languages {
  En = 'EN',
  Ru = 'RU'
}

/** API queries */
export type Query = {
  __typename?: 'Query';
  node?: Maybe<Node>;
  /** Get specific person */
  person?: Maybe<Person>;
  /** Get all persons */
  persons: PersonConnection;
  /** Get specific location */
  location?: Maybe<Location>;
  /** Get all locations */
  locations: LocationConnection;
  /** Get specific locationInstances */
  locationInstance?: Maybe<LocationInstance>;
  /** Get all locationInstances */
  locationInstances: Array<LocationInstance>;
  /** Get relations on user request */
  search: Array<Relation>;
  /** Returns list of all location types */
  locationTypes: Array<LocationType>;
  /** Get specific relation */
  relation?: Maybe<Relation>;
  /** Get all relations */
  relations: RelationConnection;
  /** Get specific relation type */
  relationType?: Maybe<RelationType>;
  /** List of available relation types */
  relationTypes: RelationTypeConnection;
  /** Get all routes */
  routes: Array<Route>;
  /** Get nearest routes */
  nearestRoutes: Array<Route>;
  /** Get specific route by id */
  route?: Maybe<Route>;
  /** Get info about user */
  me: User;
  /** Get specific Quest */
  quest?: Maybe<Quest>;
  /** Get all quests */
  quests: QuestConnection;
};


/** API queries */
export type QueryNodeArgs = {
  id: Scalars['ID'];
};


/** API queries */
export type QueryPersonArgs = {
  id: Scalars['GlobalId'];
};


/** API queries */
export type QueryPersonsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** API queries */
export type QueryLocationArgs = {
  id: Scalars['GlobalId'];
};


/** API queries */
export type QueryLocationsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** API queries */
export type QueryLocationInstanceArgs = {
  id: Scalars['GlobalId'];
};


/** API queries */
export type QuerySearchArgs = {
  searchString: Scalars['String'];
};


/** API queries */
export type QueryRelationArgs = {
  id: Scalars['GlobalId'];
};


/** API queries */
export type QueryRelationsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** API queries */
export type QueryRelationTypeArgs = {
  id: Scalars['GlobalId'];
};


/** API queries */
export type QueryRelationTypesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** API queries */
export type QueryRoutesArgs = {
  filter?: Maybe<RoutesFilter>;
};


/** API queries */
export type QueryNearestRoutesArgs = {
  center: Coordinates;
  radius?: Maybe<Scalars['Float']>;
  filter?: Maybe<RoutesFilter>;
};


/** API queries */
export type QueryRouteArgs = {
  id: Scalars['GlobalId'];
};


/** API queries */
export type QueryQuestArgs = {
  id: Scalars['GlobalId'];
};


/** API queries */
export type QueryQuestsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** API mutations */
export type Mutation = {
  __typename?: 'Mutation';
  /** Unused field to let extend this type */
  _?: Maybe<Scalars['Boolean']>;
  person?: Maybe<PersonMutations>;
  location: LocationMutations;
  locationInstances: LocationInstanceMutations;
  relation: RelationMutations;
  relationType: RelationTypeMutations;
  /** Save route to user */
  saveRoute: User;
  /** Unsave route from user */
  deleteRouteFromSaved: User;
  /** Add route to user liked routes */
  likeRoute: User;
  /** Dislike route */
  dislikeRoute: User;
  quest: QuestMutations;
};


/** API mutations */
export type MutationSaveRouteArgs = {
  routeId: Scalars['String'];
};


/** API mutations */
export type MutationDeleteRouteFromSavedArgs = {
  routeId: Scalars['String'];
};


/** API mutations */
export type MutationLikeRouteArgs = {
  routeId: Scalars['String'];
};


/** API mutations */
export type MutationDislikeRouteArgs = {
  routeId: Scalars['String'];
};

export type Person = Node & {
  __typename?: 'Person';
  /** Person's id */
  id: Scalars['ID'];
  /** Person's first name */
  firstName?: Maybe<Scalars['String']>;
  /** Person's last name */
  lastName?: Maybe<Scalars['String']>;
  /** Person's patronymic */
  patronymic?: Maybe<Scalars['String']>;
  /** Person's pseudonym */
  pseudonym?: Maybe<Scalars['String']>;
  /** Person's professions */
  professions?: Maybe<Array<Maybe<Scalars['MultilingualString']>>>;
  /** Person's description */
  description?: Maybe<Scalars['String']>;
  /** Person's birth date */
  birthDate?: Maybe<Scalars['String']>;
  /** Person's death date */
  deathDate?: Maybe<Scalars['String']>;
  /** Person relations */
  relations: Array<Relation>;
  /** Person's info link */
  wikiLink?: Maybe<Scalars['String']>;
  /** Person's main photo */
  mainPhotoLink?: Maybe<Scalars['String']>;
  /** Person's photos links */
  photoLinks?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Model for representing list of persons */
export type PersonConnection = {
  __typename?: 'PersonConnection';
  /** List of persons edges */
  edges: Array<PersonEdge>;
  /** Information about this page */
  pageInfo: PageInfo;
  /** Number of available edges */
  totalCount: Scalars['Int'];
};

/** Information about specific person in connection */
export type PersonEdge = {
  __typename?: 'PersonEdge';
  /** Cursor of this person */
  cursor: Scalars['Cursor'];
  /** Person info */
  node: Person;
};

/** Information about current page */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** Information about the existence of the next page */
  hasNextPage: Scalars['Boolean'];
  /** Information about the existence of the previous page */
  hasPreviousPage: Scalars['Boolean'];
  /** First cursor on this page */
  startCursor?: Maybe<Scalars['Cursor']>;
  /** Last cursor on this page */
  endCursor?: Maybe<Scalars['Cursor']>;
};

export type CreatePersonInput = {
  /** Person's last name */
  lastName?: Maybe<Scalars['String']>;
  /** Person's first name */
  firstName?: Maybe<Scalars['String']>;
  /** Person's patronymic */
  patronymic?: Maybe<Scalars['String']>;
  /** Person's pseudonym */
  pseudonym?: Maybe<Scalars['String']>;
  /** Person's professions */
  professions?: Maybe<Array<Scalars['String']>>;
  /** Person's description */
  description?: Maybe<Scalars['String']>;
  /** Person's birth date */
  birthDate?: Maybe<Scalars['String']>;
  /** Person's death date */
  deathDate?: Maybe<Scalars['String']>;
  /** Person's info link */
  wikiLink?: Maybe<Scalars['String']>;
};

export type CreatePersonPayload = {
  __typename?: 'CreatePersonPayload';
  /** Created person id */
  recordId: Scalars['GlobalId'];
  /** Created person */
  record: Person;
};

export type UpdatePersonInput = {
  /** ID of person for updating */
  id: Scalars['GlobalId'];
  /** Person's last name */
  lastName?: Maybe<Scalars['String']>;
  /** Person's first name */
  firstName?: Maybe<Scalars['String']>;
  /** Person's patronymic */
  patronymic?: Maybe<Scalars['String']>;
  /** Person's pseudonym */
  pseudonym?: Maybe<Scalars['String']>;
  /** Person's professions */
  professions?: Maybe<Array<Scalars['String']>>;
  /** Person's description */
  description?: Maybe<Scalars['String']>;
  /** Person's birth date */
  birthDate?: Maybe<Scalars['String']>;
  /** Person's death date */
  deathDate?: Maybe<Scalars['String']>;
  /** Person's info link */
  wikiLink?: Maybe<Scalars['String']>;
};

export type UpdatePersonPayload = {
  __typename?: 'UpdatePersonPayload';
  /** Updated person id */
  recordId: Scalars['GlobalId'];
  /** Updated person */
  record: Person;
};

export type DeletePersonPayload = {
  __typename?: 'DeletePersonPayload';
  /** Deleted person id */
  recordId: Scalars['GlobalId'];
};

export type PersonMutations = {
  __typename?: 'PersonMutations';
  /** Create person */
  create: CreatePersonPayload;
  /** Update person */
  update: UpdatePersonPayload;
  /** Delete person */
  delete: DeletePersonPayload;
};


export type PersonMutationsCreateArgs = {
  input: CreatePersonInput;
};


export type PersonMutationsUpdateArgs = {
  input: UpdatePersonInput;
};


export type PersonMutationsDeleteArgs = {
  id: Scalars['GlobalId'];
};

/** Location type to add it to Location */
export type LocationType = Node & {
  __typename?: 'LocationType';
  /** LocationType's ID */
  id: Scalars['ID'];
  /** LocationTypes's name */
  name?: Maybe<Scalars['String']>;
};

/** Country data in address of location */
export type Country = Node & {
  __typename?: 'Country';
  /** Country identifier */
  id: Scalars['ID'];
  /** ISO 3166 country code */
  code: Scalars['String'];
  /** Country name */
  name: Scalars['MultilingualString'];
};

/** Region data in address of location */
export type Region = Node & {
  __typename?: 'Region';
  /** Region identifier */
  id: Scalars['ID'];
  /**
   * ISO 3166 country code
   * see https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
   */
  code: Scalars['String'];
  /** Region name */
  name: Scalars['MultilingualString'];
};

/** Location address representation */
export type Address = {
  __typename?: 'Address';
  /** Country data */
  country?: Maybe<Country>;
  /** Country region data */
  region?: Maybe<Region>;
  /** City name, e.g. Saint-Petersburg */
  place?: Maybe<Scalars['MultilingualString']>;
  /** City district e.g. Адмиралтейский округ */
  locality?: Maybe<Scalars['MultilingualString']>;
  /** The first line of an address e.g. Пл. Никольская 1 */
  address?: Maybe<Scalars['MultilingualString']>;
  /** An optional second line of an address */
  address2?: Maybe<Scalars['MultilingualString']>;
  /** Address postcode */
  postcode?: Maybe<Scalars['MultilingualString']>;
};

/** Location context. This can be a time period, a special description for a particular route, etc. */
export type LocationInstance = Node & {
  __typename?: 'LocationInstance';
  /** Instance's ID */
  id: Scalars['ID'];
  /** Location's name */
  name?: Maybe<Scalars['String']>;
  /** Location */
  location: Location;
  /** Location's description */
  description?: Maybe<Scalars['String']>;
  /** Link for location info */
  wikiLink?: Maybe<Scalars['String']>;
  /** Array of location's types */
  locationTypes?: Maybe<Array<Maybe<LocationType>>>;
  /** Contains links with location's photos */
  photoLinks?: Maybe<Array<Scalars['String']>>;
  /** Link with main photo */
  mainPhotoLink?: Maybe<Scalars['String']>;
  /** Location's construction date */
  constructionDate?: Maybe<Scalars['String']>;
  /** Location's demolition date */
  demolitionDate?: Maybe<Scalars['String']>;
  /** Start of period */
  startDate?: Maybe<Scalars['String']>;
  /** End of period */
  endDate?: Maybe<Scalars['String']>;
  /** Location relations */
  relations: Array<Relation>;
  /** Array of architects */
  architects?: Maybe<Array<Maybe<Person>>>;
};

/** Location for displaying on map and making relations with persons */
export type Location = Node & {
  __typename?: 'Location';
  /** Location's ID */
  id: Scalars['ID'];
  /** Location position latitude */
  latitude?: Maybe<Scalars['Float']>;
  /** Location position longitude */
  longitude?: Maybe<Scalars['Float']>;
  /** Array of addresses ids */
  addresses?: Maybe<Array<Address>>;
  /** Possible location representations */
  instances: Array<LocationInstance>;
};

/** Model for representing list of locations */
export type LocationConnection = {
  __typename?: 'LocationConnection';
  /** List of locations edges */
  edges: Array<LocationEdge>;
  /** Information about this page */
  pageInfo: PageInfo;
  /** Number of available edges */
  totalCount: Scalars['Int'];
};

/** Information about specific location in connection */
export type LocationEdge = {
  __typename?: 'LocationEdge';
  /** Cursor of this location */
  cursor: Scalars['Cursor'];
  /** Location info */
  node: Location;
};

/** Input type for updating address in location */
export type UpdateAddressInput = {
  /** Unique country code from ISO 3166 */
  countryCode?: Maybe<Scalars['String']>;
  /** Unique region code from ISO 3166 */
  regionCode?: Maybe<Scalars['String']>;
  /** City name, e.g. Saint-Petersburg */
  place?: Maybe<Scalars['MultilingualString']>;
  /** City district e.g. Адмиралтейский округ */
  locality?: Maybe<Scalars['MultilingualString']>;
  /** The first line of an address e.g. Пл. Никольская 1 */
  address?: Maybe<Scalars['MultilingualString']>;
  /** An optional second line of an address */
  address2?: Maybe<Scalars['MultilingualString']>;
  /** Address postcode */
  postcode?: Maybe<Scalars['MultilingualString']>;
};

/** Input type for specifying address in new location */
export type CreateAddressInput = {
  /** Unique country code from ISO 3166 */
  countryCode: Scalars['String'];
  /** Unique region code from ISO 3166 */
  regionCode: Scalars['String'];
  /** City name, e.g. Saint-Petersburg */
  place?: Maybe<Scalars['MultilingualString']>;
  /** City district e.g. Адмиралтейский округ */
  locality?: Maybe<Scalars['MultilingualString']>;
  /** The first line of an address e.g. Пл. Никольская 1 */
  address: Scalars['MultilingualString'];
  /** An optional second line of an address */
  address2?: Maybe<Scalars['MultilingualString']>;
  /** Address postcode */
  postcode?: Maybe<Scalars['MultilingualString']>;
};

/** Input for creating new location */
export type CreateLocationInput = {
  /** Location position latitude */
  latitude: Scalars['Float'];
  /** Location position longitude */
  longitude: Scalars['Float'];
  /** Possible location representations */
  instances: Array<LocationInstanceInput>;
  /** Address to bind to new location */
  addresses: Array<CreateAddressInput>;
};

export type LocationInstanceInput = {
  /** Location's name */
  name: Scalars['MultilingualString'];
  /** Location's description */
  description: Scalars['MultilingualString'];
  /** Link for location info */
  wikiLink?: Maybe<Scalars['String']>;
  /** Contains links with location's photos */
  photoLinks?: Maybe<Array<Scalars['String']>>;
  /** Link with main photo */
  mainPhotoLink?: Maybe<Scalars['String']>;
  /** Location's construction date */
  constructionDate?: Maybe<Scalars['String']>;
  /** Location's demolition date */
  demolitionDate?: Maybe<Scalars['String']>;
  /** Start of period */
  startDate?: Maybe<Scalars['String']>;
  /** End of period */
  endDate?: Maybe<Scalars['String']>;
};

export type CreateLocationPayload = {
  __typename?: 'CreateLocationPayload';
  /** Created location id */
  recordId: Scalars['GlobalId'];
  /** Created location */
  record: Location;
};

export type UpdateLocationInput = {
  /** Location id to update */
  id: Scalars['GlobalId'];
  /** Location position latitude */
  latitude?: Maybe<Scalars['Float']>;
  /** Location position longitude */
  longitude?: Maybe<Scalars['Float']>;
  /** Updated location address */
  addresses?: Maybe<Array<UpdateAddressInput>>;
};

export type UpdateLocationPayload = {
  __typename?: 'UpdateLocationPayload';
  /** Updated location id */
  recordId: Scalars['GlobalId'];
  /** Updated location */
  record: Location;
};

export type DeleteLocationPayload = {
  __typename?: 'DeleteLocationPayload';
  /** Deleted location id */
  recordId: Scalars['GlobalId'];
};

export type LocationMutations = {
  __typename?: 'LocationMutations';
  /** Create location */
  create: CreateLocationPayload;
  /** Update location */
  update: UpdateLocationPayload;
  /** Delete location */
  delete: DeleteLocationPayload;
};


export type LocationMutationsCreateArgs = {
  input: CreateLocationInput;
};


export type LocationMutationsUpdateArgs = {
  input: UpdateLocationInput;
};


export type LocationMutationsDeleteArgs = {
  id: Scalars['GlobalId'];
};

export type CreateLocationInstanceInput = {
  /** Location's name */
  name: Scalars['MultilingualString'];
  /** Location's description */
  description: Scalars['MultilingualString'];
  /** Link for location info */
  wikiLink?: Maybe<Scalars['String']>;
  /** Contains links with location's photos */
  photoLinks?: Maybe<Array<Scalars['String']>>;
  /** Link with main photo */
  mainPhotoLink?: Maybe<Scalars['String']>;
  /** Location's construction date */
  constructionDate?: Maybe<Scalars['String']>;
  /** Location's demolition date */
  demolitionDate?: Maybe<Scalars['String']>;
  /** Start of period */
  startDate?: Maybe<Scalars['String']>;
  /** End of period */
  endDate?: Maybe<Scalars['String']>;
  /** Location id to which this instance below */
  locationId: Scalars['GlobalId'];
};

export type CreateLocationInstancePayload = {
  __typename?: 'CreateLocationInstancePayload';
  /** Created location id */
  recordId: Scalars['GlobalId'];
  /** Created location */
  record: LocationInstance;
};

export type UpdateLocationInstanceInput = {
  /** Location instance id */
  id: Scalars['GlobalId'];
  /** Location's name */
  name: Scalars['MultilingualString'];
  /** Location's description */
  description: Scalars['MultilingualString'];
  /** Link for location info */
  wikiLink?: Maybe<Scalars['String']>;
  /** Contains links with location's photos */
  photoLinks?: Maybe<Array<Scalars['String']>>;
  /** Link with main photo */
  mainPhotoLink?: Maybe<Scalars['String']>;
  /** Location's construction date */
  constructionDate?: Maybe<Scalars['String']>;
  /** Location's demolition date */
  demolitionDate?: Maybe<Scalars['String']>;
  /** Start of period */
  startDate?: Maybe<Scalars['String']>;
  /** End of period */
  endDate?: Maybe<Scalars['String']>;
};

export type UpdateLocationInstancePayload = {
  __typename?: 'UpdateLocationInstancePayload';
  /** Created location id */
  recordId: Scalars['GlobalId'];
  /** Created location */
  record: LocationInstance;
};

export type DeleteLocationInstancePayload = {
  __typename?: 'DeleteLocationInstancePayload';
  /** Created location id */
  recordId: Scalars['GlobalId'];
};

export type AddArchitectInput = {
  /** Location instance id */
  locationInstanceId: Scalars['GlobalId'];
  /** Architect for adding */
  architectId: Scalars['GlobalId'];
};

export type AddArchitectPayload = {
  __typename?: 'AddArchitectPayload';
  /** New relation id */
  recordId: Scalars['GlobalId'];
  /** New relation */
  record: Relation;
};

export type RemoveArchitectInput = {
  /** Location instance id */
  locationInstanceId: Scalars['GlobalId'];
  /** Architect for removing */
  architectId: Scalars['GlobalId'];
};

export type RemoveArchitectPayload = {
  __typename?: 'RemoveArchitectPayload';
  /** Deleted relation id */
  recordId: Scalars['GlobalId'];
};

export type LocationInstanceMutations = {
  __typename?: 'LocationInstanceMutations';
  /** Create location instance */
  create: CreateLocationInstancePayload;
  /** Add architect to location instance */
  addArchitect: AddArchitectPayload;
  /** Remove architects from location instance */
  removeArchitect: RemoveArchitectPayload;
  /** Update location instance */
  update: UpdateLocationInstancePayload;
  /** Delete location instance */
  delete: DeleteLocationInstancePayload;
};


export type LocationInstanceMutationsCreateArgs = {
  input: CreateLocationInstanceInput;
};


export type LocationInstanceMutationsAddArchitectArgs = {
  input: AddArchitectInput;
};


export type LocationInstanceMutationsRemoveArchitectArgs = {
  input: RemoveArchitectInput;
};


export type LocationInstanceMutationsUpdateArgs = {
  input: UpdateLocationInstanceInput;
};


export type LocationInstanceMutationsDeleteArgs = {
  id: Scalars['GlobalId'];
};

/** Represents relation between person and location */
export type Relation = Node & {
  __typename?: 'Relation';
  /** Relation's id */
  id: Scalars['ID'];
  /** Person in relation */
  person?: Maybe<Person>;
  /** Location in relation */
  locationInstance?: Maybe<LocationInstance>;
  /** Relation type */
  relationType?: Maybe<RelationType>;
  /** Relation's quote */
  quote?: Maybe<Scalars['String']>;
};

/** Model for representing list of relations */
export type RelationConnection = {
  __typename?: 'RelationConnection';
  /** List of persons edges */
  edges: Array<RelationEdge>;
  /** Information about this page */
  pageInfo: PageInfo;
  /** Number of available edges */
  totalCount: Scalars['Int'];
};

/** Information about specific relation in connection */
export type RelationEdge = {
  __typename?: 'RelationEdge';
  /** Cursor of this person */
  cursor: Scalars['Cursor'];
  /** Person info */
  node: Relation;
};

export type CreateRelationInput = {
  /** Person ID in relation */
  personId: Scalars['GlobalId'];
  /** Location Instance ID in relation */
  locationInstanceId: Scalars['GlobalId'];
  /** Relation type ID */
  relationId: Scalars['GlobalId'];
  /** Quote about relation */
  quote: Scalars['MultilingualString'];
};

export type UpdateRelationInput = {
  /** ID of relation for updating */
  id: Scalars['GlobalId'];
  /** Person ID in relation */
  personId?: Maybe<Scalars['GlobalId']>;
  /** Location Instance ID in relation */
  locationInstanceId?: Maybe<Scalars['GlobalId']>;
  /** Relation type ID */
  relationId?: Maybe<Scalars['GlobalId']>;
  /** Quote about relation */
  quote?: Maybe<Scalars['MultilingualString']>;
};

export type CreateRelationPayload = {
  __typename?: 'CreateRelationPayload';
  /** Created relation id */
  recordId: Scalars['GlobalId'];
  /** Created relation */
  record: Relation;
};

export type UpdateRelationPayload = {
  __typename?: 'UpdateRelationPayload';
  /** Updated relation id */
  recordId: Scalars['GlobalId'];
  /** Updated relation */
  record: Relation;
};

export type DeleteRelationPayload = {
  __typename?: 'DeleteRelationPayload';
  /** Deleted relation id */
  recordId: Scalars['GlobalId'];
};

export type RelationMutations = {
  __typename?: 'RelationMutations';
  /** Create relation */
  create: CreateRelationPayload;
  /** Update relation */
  update: UpdateRelationPayload;
  /** Delete relation */
  delete: DeleteRelationPayload;
};


export type RelationMutationsCreateArgs = {
  input: CreateRelationInput;
};


export type RelationMutationsUpdateArgs = {
  input: UpdateRelationInput;
};


export type RelationMutationsDeleteArgs = {
  id: Scalars['GlobalId'];
};

/** Represents one of the relations types */
export type RelationType = Node & {
  __typename?: 'RelationType';
  /** Relation type id */
  id: Scalars['ID'];
  /** Relation type name */
  name: Scalars['MultilingualString'];
  /** Relation type synonyms */
  synonyms: Array<Maybe<Scalars['MultilingualString']>>;
};

/** Information about specific relation type in connection */
export type RelationTypeEdge = {
  __typename?: 'RelationTypeEdge';
  /** Cursor of this relation type */
  cursor: Scalars['Cursor'];
  /** Relation type info */
  node: RelationType;
};

/** Model for representing list of relation types */
export type RelationTypeConnection = {
  __typename?: 'RelationTypeConnection';
  /** List of relation types edges */
  edges: Array<RelationTypeEdge>;
  /** Information about this page */
  pageInfo: PageInfo;
  /** Number of available edges */
  totalCount: Scalars['Int'];
};

export type CreateRelationTypeInput = {
  /** Relation type name */
  name: Scalars['MultilingualString'];
  /** Relation type synonyms */
  synonyms: Array<Maybe<Scalars['String']>>;
};

export type UpdateRelationTypeInput = {
  /** ID of relation type for updating */
  id: Scalars['GlobalId'];
  /** Relation type name */
  name?: Maybe<Scalars['MultilingualString']>;
  /** Relation type synonyms */
  synonyms?: Maybe<Array<Scalars['String']>>;
};

export type CreateRelationTypePayload = {
  __typename?: 'CreateRelationTypePayload';
  /** Created relation type id */
  recordId: Scalars['GlobalId'];
  /** Created relation type */
  record: RelationType;
};

export type UpdateRelationTypePayload = {
  __typename?: 'UpdateRelationTypePayload';
  /** Updated relation type id */
  recordId: Scalars['GlobalId'];
  /** Updated relation type */
  record: RelationType;
};

export type DeleteRelationTypePayload = {
  __typename?: 'DeleteRelationTypePayload';
  /** Deleted relation type id */
  recordId: Scalars['GlobalId'];
};

export type RelationTypeMutations = {
  __typename?: 'RelationTypeMutations';
  /** Creates relation type */
  create: CreateRelationTypePayload;
  /** Update relation type */
  update: UpdateRelationTypePayload;
  /** Delete relation type */
  delete: DeleteRelationTypePayload;
};


export type RelationTypeMutationsCreateArgs = {
  input: CreateRelationTypeInput;
};


export type RelationTypeMutationsUpdateArgs = {
  input: UpdateRelationTypeInput;
};


export type RelationTypeMutationsDeleteArgs = {
  id: Scalars['GlobalId'];
};

/** Input to search routes */
export type RoutesFilter = {
  /** String for searching in all languages */
  contains: Scalars['String'];
};

/** Route between locations */
export type Route = Node & {
  __typename?: 'Route';
  /** Route id */
  id: Scalars['ID'];
  /** Route name */
  name?: Maybe<Scalars['String']>;
  /** Route locations */
  locationsInstance: Array<Maybe<LocationInstance>>;
  /** Route description */
  description?: Maybe<Scalars['String']>;
  /** Route photo */
  photoLink?: Maybe<Scalars['String']>;
};

export type Coordinates = {
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
};

export type User = Node & {
  __typename?: 'User';
  /** User's ID */
  id: Scalars['ID'];
  /** Username */
  username: Scalars['String'];
  /** User saved routes */
  savedRoutes: Array<Route>;
  /** User liked routes */
  likedRoutes: Array<Route>;
};

/**
 * Data saved from Editor.js
 * See https://editorjs.io/saving-data
 */
export type EditorData = {
  __typename?: 'EditorData';
  /** Saving timestamp */
  time?: Maybe<Scalars['Timestamp']>;
  /** List of Blocks data */
  blocks: Array<Scalars['JSON']>;
  /** Version of Editor.js */
  version?: Maybe<Scalars['String']>;
};

/**
 * Data saved from Editor.js
 * See https://editorjs.io/saving-data
 */
export type EditorDataInput = {
  /** Saving timestamp */
  time?: Maybe<Scalars['Timestamp']>;
  /** List of Blocks data */
  blocks: Array<Scalars['JSON']>;
  /** Version of Editor.js */
  version?: Maybe<Scalars['String']>;
};

export type Quest = Node & {
  __typename?: 'Quest';
  /** Quest ID */
  id: Scalars['ID'];
  /** Quest name */
  name: Scalars['String'];
  /** Quest description */
  description?: Maybe<Scalars['String']>;
  /** Quest photo */
  photo?: Maybe<Scalars['String']>;
  /** Quest type (quiz, route, etc.) */
  type: TaskTypes;
  /** Quest task */
  task: Scalars['JSON'];
  /** Quest data */
  data?: Maybe<EditorData>;
  /** Quest rewards */
  rewards: Array<Scalars['JSON']>;
};

/** Model for representing list of quests */
export type QuestConnection = {
  __typename?: 'QuestConnection';
  /** List of quests edges */
  edges: Array<QuestEdge>;
  /** Information about this page */
  pageInfo: PageInfo;
  /** Number of available edges */
  totalCount: Scalars['Int'];
};

/** Information about specific quest in connection */
export type QuestEdge = {
  __typename?: 'QuestEdge';
  /** Cursor of this quest */
  cursor: Scalars['Cursor'];
  /** Quest info */
  node: Quest;
};

/** Possible task types */
export enum TaskTypes {
  /** Task type quiz */
  Quiz = 'QUIZ',
  /** Task type route */
  Route = 'ROUTE'
}

export type CreateQuestInput = {
  /** Quest name */
  name: Scalars['String'];
  /** Quest description */
  description?: Maybe<Scalars['String']>;
  /** Quest photo */
  photo?: Maybe<Scalars['String']>;
  /** Quest type (quiz, route, etc.) */
  type?: TaskTypes;
  /** Quest data */
  data: EditorDataInput;
};

export type CreateQuestPayload = {
  __typename?: 'CreateQuestPayload';
  /** Created quest id */
  recordId: Scalars['GlobalId'];
  /** Created quest */
  record: Quest;
};

export type UpdateQuestInput = {
  /** Quest ID */
  id: Scalars['GlobalId'];
  /** Quest name */
  name?: Maybe<Scalars['String']>;
  /** Quest description */
  description?: Maybe<Scalars['String']>;
  /** Quest photo */
  photo?: Maybe<Scalars['String']>;
  /** Quest type (quiz, route, etc.) */
  type?: Maybe<TaskTypes>;
  /** Quest data */
  data?: Maybe<EditorDataInput>;
};

export type UpdateQuestPayload = {
  __typename?: 'UpdateQuestPayload';
  /** Updated quest id */
  recordId: Scalars['GlobalId'];
  /** Updated quest */
  record: Quest;
};

export type DeleteQuestPayload = {
  __typename?: 'DeleteQuestPayload';
  /** Deleted quest id */
  recordId: Scalars['GlobalId'];
};

export type QuestMutations = {
  __typename?: 'QuestMutations';
  /** Create quest */
  create: CreateQuestPayload;
  /** Update quest */
  update: UpdateQuestPayload;
  /** Delete quest */
  delete: DeleteQuestPayload;
};


export type QuestMutationsCreateArgs = {
  input: CreateQuestInput;
};


export type QuestMutationsUpdateArgs = {
  input: UpdateQuestInput;
};


export type QuestMutationsDeleteArgs = {
  id: Scalars['GlobalId'];
};






export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Node: ResolversTypes['Person'] | ResolversTypes['LocationType'] | ResolversTypes['Country'] | ResolversTypes['Region'] | ResolversTypes['LocationInstance'] | ResolversTypes['Location'] | ResolversTypes['Relation'] | ResolversTypes['RelationType'] | ResolversTypes['Route'] | ResolversTypes['User'] | ResolversTypes['Quest'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']>;
  ObjectId: ResolverTypeWrapper<Scalars['ObjectId']>;
  MultilingualString: ResolverTypeWrapper<Scalars['MultilingualString']>;
  GlobalId: ResolverTypeWrapper<Scalars['GlobalId']>;
  Languages: Languages;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Person: ResolverTypeWrapper<Person>;
  PersonConnection: ResolverTypeWrapper<PersonConnection>;
  PersonEdge: ResolverTypeWrapper<PersonEdge>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  CreatePersonInput: CreatePersonInput;
  CreatePersonPayload: ResolverTypeWrapper<CreatePersonPayload>;
  UpdatePersonInput: UpdatePersonInput;
  UpdatePersonPayload: ResolverTypeWrapper<UpdatePersonPayload>;
  DeletePersonPayload: ResolverTypeWrapper<DeletePersonPayload>;
  PersonMutations: ResolverTypeWrapper<PersonMutations>;
  LocationType: ResolverTypeWrapper<LocationType>;
  Country: ResolverTypeWrapper<Country>;
  Region: ResolverTypeWrapper<Region>;
  Address: ResolverTypeWrapper<Address>;
  LocationInstance: ResolverTypeWrapper<LocationInstance>;
  Location: ResolverTypeWrapper<Location>;
  LocationConnection: ResolverTypeWrapper<LocationConnection>;
  LocationEdge: ResolverTypeWrapper<LocationEdge>;
  UpdateAddressInput: UpdateAddressInput;
  CreateAddressInput: CreateAddressInput;
  CreateLocationInput: CreateLocationInput;
  LocationInstanceInput: LocationInstanceInput;
  CreateLocationPayload: ResolverTypeWrapper<CreateLocationPayload>;
  UpdateLocationInput: UpdateLocationInput;
  UpdateLocationPayload: ResolverTypeWrapper<UpdateLocationPayload>;
  DeleteLocationPayload: ResolverTypeWrapper<DeleteLocationPayload>;
  LocationMutations: ResolverTypeWrapper<LocationMutations>;
  CreateLocationInstanceInput: CreateLocationInstanceInput;
  CreateLocationInstancePayload: ResolverTypeWrapper<CreateLocationInstancePayload>;
  UpdateLocationInstanceInput: UpdateLocationInstanceInput;
  UpdateLocationInstancePayload: ResolverTypeWrapper<UpdateLocationInstancePayload>;
  DeleteLocationInstancePayload: ResolverTypeWrapper<DeleteLocationInstancePayload>;
  AddArchitectInput: AddArchitectInput;
  AddArchitectPayload: ResolverTypeWrapper<AddArchitectPayload>;
  RemoveArchitectInput: RemoveArchitectInput;
  RemoveArchitectPayload: ResolverTypeWrapper<RemoveArchitectPayload>;
  LocationInstanceMutations: ResolverTypeWrapper<LocationInstanceMutations>;
  Relation: ResolverTypeWrapper<Relation>;
  RelationConnection: ResolverTypeWrapper<RelationConnection>;
  RelationEdge: ResolverTypeWrapper<RelationEdge>;
  CreateRelationInput: CreateRelationInput;
  UpdateRelationInput: UpdateRelationInput;
  CreateRelationPayload: ResolverTypeWrapper<CreateRelationPayload>;
  UpdateRelationPayload: ResolverTypeWrapper<UpdateRelationPayload>;
  DeleteRelationPayload: ResolverTypeWrapper<DeleteRelationPayload>;
  RelationMutations: ResolverTypeWrapper<RelationMutations>;
  RelationType: ResolverTypeWrapper<RelationType>;
  RelationTypeEdge: ResolverTypeWrapper<RelationTypeEdge>;
  RelationTypeConnection: ResolverTypeWrapper<RelationTypeConnection>;
  CreateRelationTypeInput: CreateRelationTypeInput;
  UpdateRelationTypeInput: UpdateRelationTypeInput;
  CreateRelationTypePayload: ResolverTypeWrapper<CreateRelationTypePayload>;
  UpdateRelationTypePayload: ResolverTypeWrapper<UpdateRelationTypePayload>;
  DeleteRelationTypePayload: ResolverTypeWrapper<DeleteRelationTypePayload>;
  RelationTypeMutations: ResolverTypeWrapper<RelationTypeMutations>;
  RoutesFilter: RoutesFilter;
  Route: ResolverTypeWrapper<Route>;
  Coordinates: Coordinates;
  User: ResolverTypeWrapper<User>;
  EditorData: ResolverTypeWrapper<EditorData>;
  EditorDataInput: EditorDataInput;
  Quest: ResolverTypeWrapper<Quest>;
  QuestConnection: ResolverTypeWrapper<QuestConnection>;
  QuestEdge: ResolverTypeWrapper<QuestEdge>;
  TaskTypes: TaskTypes;
  CreateQuestInput: CreateQuestInput;
  CreateQuestPayload: ResolverTypeWrapper<CreateQuestPayload>;
  UpdateQuestInput: UpdateQuestInput;
  UpdateQuestPayload: ResolverTypeWrapper<UpdateQuestPayload>;
  DeleteQuestPayload: ResolverTypeWrapper<DeleteQuestPayload>;
  QuestMutations: ResolverTypeWrapper<QuestMutations>;
  Long: ResolverTypeWrapper<Scalars['Long']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Node: ResolversParentTypes['Person'] | ResolversParentTypes['LocationType'] | ResolversParentTypes['Country'] | ResolversParentTypes['Region'] | ResolversParentTypes['LocationInstance'] | ResolversParentTypes['Location'] | ResolversParentTypes['Relation'] | ResolversParentTypes['RelationType'] | ResolversParentTypes['Route'] | ResolversParentTypes['User'] | ResolversParentTypes['Quest'];
  ID: Scalars['ID'];
  Cursor: Scalars['Cursor'];
  ObjectId: Scalars['ObjectId'];
  MultilingualString: Scalars['MultilingualString'];
  GlobalId: Scalars['GlobalId'];
  Query: {};
  Int: Scalars['Int'];
  String: Scalars['String'];
  Float: Scalars['Float'];
  Mutation: {};
  Boolean: Scalars['Boolean'];
  Person: Person;
  PersonConnection: PersonConnection;
  PersonEdge: PersonEdge;
  PageInfo: PageInfo;
  CreatePersonInput: CreatePersonInput;
  CreatePersonPayload: CreatePersonPayload;
  UpdatePersonInput: UpdatePersonInput;
  UpdatePersonPayload: UpdatePersonPayload;
  DeletePersonPayload: DeletePersonPayload;
  PersonMutations: PersonMutations;
  LocationType: LocationType;
  Country: Country;
  Region: Region;
  Address: Address;
  LocationInstance: LocationInstance;
  Location: Location;
  LocationConnection: LocationConnection;
  LocationEdge: LocationEdge;
  UpdateAddressInput: UpdateAddressInput;
  CreateAddressInput: CreateAddressInput;
  CreateLocationInput: CreateLocationInput;
  LocationInstanceInput: LocationInstanceInput;
  CreateLocationPayload: CreateLocationPayload;
  UpdateLocationInput: UpdateLocationInput;
  UpdateLocationPayload: UpdateLocationPayload;
  DeleteLocationPayload: DeleteLocationPayload;
  LocationMutations: LocationMutations;
  CreateLocationInstanceInput: CreateLocationInstanceInput;
  CreateLocationInstancePayload: CreateLocationInstancePayload;
  UpdateLocationInstanceInput: UpdateLocationInstanceInput;
  UpdateLocationInstancePayload: UpdateLocationInstancePayload;
  DeleteLocationInstancePayload: DeleteLocationInstancePayload;
  AddArchitectInput: AddArchitectInput;
  AddArchitectPayload: AddArchitectPayload;
  RemoveArchitectInput: RemoveArchitectInput;
  RemoveArchitectPayload: RemoveArchitectPayload;
  LocationInstanceMutations: LocationInstanceMutations;
  Relation: Relation;
  RelationConnection: RelationConnection;
  RelationEdge: RelationEdge;
  CreateRelationInput: CreateRelationInput;
  UpdateRelationInput: UpdateRelationInput;
  CreateRelationPayload: CreateRelationPayload;
  UpdateRelationPayload: UpdateRelationPayload;
  DeleteRelationPayload: DeleteRelationPayload;
  RelationMutations: RelationMutations;
  RelationType: RelationType;
  RelationTypeEdge: RelationTypeEdge;
  RelationTypeConnection: RelationTypeConnection;
  CreateRelationTypeInput: CreateRelationTypeInput;
  UpdateRelationTypeInput: UpdateRelationTypeInput;
  CreateRelationTypePayload: CreateRelationTypePayload;
  UpdateRelationTypePayload: UpdateRelationTypePayload;
  DeleteRelationTypePayload: DeleteRelationTypePayload;
  RelationTypeMutations: RelationTypeMutations;
  RoutesFilter: RoutesFilter;
  Route: Route;
  Coordinates: Coordinates;
  User: User;
  EditorData: EditorData;
  EditorDataInput: EditorDataInput;
  Quest: Quest;
  QuestConnection: QuestConnection;
  QuestEdge: QuestEdge;
  CreateQuestInput: CreateQuestInput;
  CreateQuestPayload: CreateQuestPayload;
  UpdateQuestInput: UpdateQuestInput;
  UpdateQuestPayload: UpdateQuestPayload;
  DeleteQuestPayload: DeleteQuestPayload;
  QuestMutations: QuestMutations;
  Long: Scalars['Long'];
  JSON: Scalars['JSON'];
  Timestamp: Scalars['Timestamp'];
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Person' | 'LocationType' | 'Country' | 'Region' | 'LocationInstance' | 'Location' | 'Relation' | 'RelationType' | 'Route' | 'User' | 'Quest', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export interface CursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cursor'], any> {
  name: 'Cursor';
}

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectId'], any> {
  name: 'ObjectId';
}

export interface MultilingualStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['MultilingualString'], any> {
  name: 'MultilingualString';
}

export interface GlobalIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['GlobalId'], any> {
  name: 'GlobalId';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  person?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType, RequireFields<QueryPersonArgs, 'id'>>;
  persons?: Resolver<ResolversTypes['PersonConnection'], ParentType, ContextType, RequireFields<QueryPersonsArgs, never>>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType, RequireFields<QueryLocationArgs, 'id'>>;
  locations?: Resolver<ResolversTypes['LocationConnection'], ParentType, ContextType, RequireFields<QueryLocationsArgs, never>>;
  locationInstance?: Resolver<Maybe<ResolversTypes['LocationInstance']>, ParentType, ContextType, RequireFields<QueryLocationInstanceArgs, 'id'>>;
  locationInstances?: Resolver<Array<ResolversTypes['LocationInstance']>, ParentType, ContextType>;
  search?: Resolver<Array<ResolversTypes['Relation']>, ParentType, ContextType, RequireFields<QuerySearchArgs, 'searchString'>>;
  locationTypes?: Resolver<Array<ResolversTypes['LocationType']>, ParentType, ContextType>;
  relation?: Resolver<Maybe<ResolversTypes['Relation']>, ParentType, ContextType, RequireFields<QueryRelationArgs, 'id'>>;
  relations?: Resolver<ResolversTypes['RelationConnection'], ParentType, ContextType, RequireFields<QueryRelationsArgs, never>>;
  relationType?: Resolver<Maybe<ResolversTypes['RelationType']>, ParentType, ContextType, RequireFields<QueryRelationTypeArgs, 'id'>>;
  relationTypes?: Resolver<ResolversTypes['RelationTypeConnection'], ParentType, ContextType, RequireFields<QueryRelationTypesArgs, never>>;
  routes?: Resolver<Array<ResolversTypes['Route']>, ParentType, ContextType, RequireFields<QueryRoutesArgs, never>>;
  nearestRoutes?: Resolver<Array<ResolversTypes['Route']>, ParentType, ContextType, RequireFields<QueryNearestRoutesArgs, 'center' | 'radius'>>;
  route?: Resolver<Maybe<ResolversTypes['Route']>, ParentType, ContextType, RequireFields<QueryRouteArgs, 'id'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  quest?: Resolver<Maybe<ResolversTypes['Quest']>, ParentType, ContextType, RequireFields<QueryQuestArgs, 'id'>>;
  quests?: Resolver<ResolversTypes['QuestConnection'], ParentType, ContextType, RequireFields<QueryQuestsArgs, never>>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  person?: Resolver<Maybe<ResolversTypes['PersonMutations']>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes['LocationMutations'], ParentType, ContextType>;
  locationInstances?: Resolver<ResolversTypes['LocationInstanceMutations'], ParentType, ContextType>;
  relation?: Resolver<ResolversTypes['RelationMutations'], ParentType, ContextType>;
  relationType?: Resolver<ResolversTypes['RelationTypeMutations'], ParentType, ContextType>;
  saveRoute?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSaveRouteArgs, 'routeId'>>;
  deleteRouteFromSaved?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationDeleteRouteFromSavedArgs, 'routeId'>>;
  likeRoute?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationLikeRouteArgs, 'routeId'>>;
  dislikeRoute?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationDislikeRouteArgs, 'routeId'>>;
  quest?: Resolver<ResolversTypes['QuestMutations'], ParentType, ContextType>;
};

export type PersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  patronymic?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pseudonym?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  professions?: Resolver<Maybe<Array<Maybe<ResolversTypes['MultilingualString']>>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  birthDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deathDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  relations?: Resolver<Array<ResolversTypes['Relation']>, ParentType, ContextType>;
  wikiLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mainPhotoLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photoLinks?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonConnection'] = ResolversParentTypes['PersonConnection']> = {
  edges?: Resolver<Array<ResolversTypes['PersonEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonEdge'] = ResolversParentTypes['PersonEdge']> = {
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatePersonPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatePersonPayload'] = ResolversParentTypes['CreatePersonPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdatePersonPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdatePersonPayload'] = ResolversParentTypes['UpdatePersonPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeletePersonPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeletePersonPayload'] = ResolversParentTypes['DeletePersonPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonMutations'] = ResolversParentTypes['PersonMutations']> = {
  create?: Resolver<ResolversTypes['CreatePersonPayload'], ParentType, ContextType, RequireFields<PersonMutationsCreateArgs, 'input'>>;
  update?: Resolver<ResolversTypes['UpdatePersonPayload'], ParentType, ContextType, RequireFields<PersonMutationsUpdateArgs, 'input'>>;
  delete?: Resolver<ResolversTypes['DeletePersonPayload'], ParentType, ContextType, RequireFields<PersonMutationsDeleteArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocationType'] = ResolversParentTypes['LocationType']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CountryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Country'] = ResolversParentTypes['Country']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['MultilingualString'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Region'] = ResolversParentTypes['Region']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['MultilingualString'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  country?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType>;
  region?: Resolver<Maybe<ResolversTypes['Region']>, ParentType, ContextType>;
  place?: Resolver<Maybe<ResolversTypes['MultilingualString']>, ParentType, ContextType>;
  locality?: Resolver<Maybe<ResolversTypes['MultilingualString']>, ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['MultilingualString']>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes['MultilingualString']>, ParentType, ContextType>;
  postcode?: Resolver<Maybe<ResolversTypes['MultilingualString']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationInstanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocationInstance'] = ResolversParentTypes['LocationInstance']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  wikiLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  locationTypes?: Resolver<Maybe<Array<Maybe<ResolversTypes['LocationType']>>>, ParentType, ContextType>;
  photoLinks?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  mainPhotoLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  constructionDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  demolitionDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  relations?: Resolver<Array<ResolversTypes['Relation']>, ParentType, ContextType>;
  architects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Person']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  latitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  longitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  addresses?: Resolver<Maybe<Array<ResolversTypes['Address']>>, ParentType, ContextType>;
  instances?: Resolver<Array<ResolversTypes['LocationInstance']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocationConnection'] = ResolversParentTypes['LocationConnection']> = {
  edges?: Resolver<Array<ResolversTypes['LocationEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocationEdge'] = ResolversParentTypes['LocationEdge']> = {
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateLocationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateLocationPayload'] = ResolversParentTypes['CreateLocationPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateLocationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateLocationPayload'] = ResolversParentTypes['UpdateLocationPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteLocationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteLocationPayload'] = ResolversParentTypes['DeleteLocationPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocationMutations'] = ResolversParentTypes['LocationMutations']> = {
  create?: Resolver<ResolversTypes['CreateLocationPayload'], ParentType, ContextType, RequireFields<LocationMutationsCreateArgs, 'input'>>;
  update?: Resolver<ResolversTypes['UpdateLocationPayload'], ParentType, ContextType, RequireFields<LocationMutationsUpdateArgs, 'input'>>;
  delete?: Resolver<ResolversTypes['DeleteLocationPayload'], ParentType, ContextType, RequireFields<LocationMutationsDeleteArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateLocationInstancePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateLocationInstancePayload'] = ResolversParentTypes['CreateLocationInstancePayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['LocationInstance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateLocationInstancePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateLocationInstancePayload'] = ResolversParentTypes['UpdateLocationInstancePayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['LocationInstance'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteLocationInstancePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteLocationInstancePayload'] = ResolversParentTypes['DeleteLocationInstancePayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AddArchitectPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddArchitectPayload'] = ResolversParentTypes['AddArchitectPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['Relation'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RemoveArchitectPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemoveArchitectPayload'] = ResolversParentTypes['RemoveArchitectPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationInstanceMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocationInstanceMutations'] = ResolversParentTypes['LocationInstanceMutations']> = {
  create?: Resolver<ResolversTypes['CreateLocationInstancePayload'], ParentType, ContextType, RequireFields<LocationInstanceMutationsCreateArgs, 'input'>>;
  addArchitect?: Resolver<ResolversTypes['AddArchitectPayload'], ParentType, ContextType, RequireFields<LocationInstanceMutationsAddArchitectArgs, 'input'>>;
  removeArchitect?: Resolver<ResolversTypes['RemoveArchitectPayload'], ParentType, ContextType, RequireFields<LocationInstanceMutationsRemoveArchitectArgs, 'input'>>;
  update?: Resolver<ResolversTypes['UpdateLocationInstancePayload'], ParentType, ContextType, RequireFields<LocationInstanceMutationsUpdateArgs, 'input'>>;
  delete?: Resolver<ResolversTypes['DeleteLocationInstancePayload'], ParentType, ContextType, RequireFields<LocationInstanceMutationsDeleteArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Relation'] = ResolversParentTypes['Relation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  person?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType>;
  locationInstance?: Resolver<Maybe<ResolversTypes['LocationInstance']>, ParentType, ContextType>;
  relationType?: Resolver<Maybe<ResolversTypes['RelationType']>, ParentType, ContextType>;
  quote?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelationConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['RelationConnection'] = ResolversParentTypes['RelationConnection']> = {
  edges?: Resolver<Array<ResolversTypes['RelationEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelationEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RelationEdge'] = ResolversParentTypes['RelationEdge']> = {
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Relation'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateRelationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRelationPayload'] = ResolversParentTypes['CreateRelationPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['Relation'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateRelationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateRelationPayload'] = ResolversParentTypes['UpdateRelationPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['Relation'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteRelationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteRelationPayload'] = ResolversParentTypes['DeleteRelationPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelationMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['RelationMutations'] = ResolversParentTypes['RelationMutations']> = {
  create?: Resolver<ResolversTypes['CreateRelationPayload'], ParentType, ContextType, RequireFields<RelationMutationsCreateArgs, 'input'>>;
  update?: Resolver<ResolversTypes['UpdateRelationPayload'], ParentType, ContextType, RequireFields<RelationMutationsUpdateArgs, 'input'>>;
  delete?: Resolver<ResolversTypes['DeleteRelationPayload'], ParentType, ContextType, RequireFields<RelationMutationsDeleteArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelationTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RelationType'] = ResolversParentTypes['RelationType']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['MultilingualString'], ParentType, ContextType>;
  synonyms?: Resolver<Array<Maybe<ResolversTypes['MultilingualString']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelationTypeEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RelationTypeEdge'] = ResolversParentTypes['RelationTypeEdge']> = {
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['RelationType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelationTypeConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['RelationTypeConnection'] = ResolversParentTypes['RelationTypeConnection']> = {
  edges?: Resolver<Array<ResolversTypes['RelationTypeEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateRelationTypePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRelationTypePayload'] = ResolversParentTypes['CreateRelationTypePayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['RelationType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateRelationTypePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateRelationTypePayload'] = ResolversParentTypes['UpdateRelationTypePayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['RelationType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteRelationTypePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteRelationTypePayload'] = ResolversParentTypes['DeleteRelationTypePayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelationTypeMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['RelationTypeMutations'] = ResolversParentTypes['RelationTypeMutations']> = {
  create?: Resolver<ResolversTypes['CreateRelationTypePayload'], ParentType, ContextType, RequireFields<RelationTypeMutationsCreateArgs, 'input'>>;
  update?: Resolver<ResolversTypes['UpdateRelationTypePayload'], ParentType, ContextType, RequireFields<RelationTypeMutationsUpdateArgs, 'input'>>;
  delete?: Resolver<ResolversTypes['DeleteRelationTypePayload'], ParentType, ContextType, RequireFields<RelationTypeMutationsDeleteArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RouteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Route'] = ResolversParentTypes['Route']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  locationsInstance?: Resolver<Array<Maybe<ResolversTypes['LocationInstance']>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photoLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  savedRoutes?: Resolver<Array<ResolversTypes['Route']>, ParentType, ContextType>;
  likedRoutes?: Resolver<Array<ResolversTypes['Route']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EditorDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['EditorData'] = ResolversParentTypes['EditorData']> = {
  time?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  blocks?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuestResolvers<ContextType = any, ParentType extends ResolversParentTypes['Quest'] = ResolversParentTypes['Quest']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TaskTypes'], ParentType, ContextType>;
  task?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['EditorData']>, ParentType, ContextType>;
  rewards?: Resolver<Array<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuestConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestConnection'] = ResolversParentTypes['QuestConnection']> = {
  edges?: Resolver<Array<ResolversTypes['QuestEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuestEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestEdge'] = ResolversParentTypes['QuestEdge']> = {
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Quest'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateQuestPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateQuestPayload'] = ResolversParentTypes['CreateQuestPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['Quest'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateQuestPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateQuestPayload'] = ResolversParentTypes['UpdateQuestPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  record?: Resolver<ResolversTypes['Quest'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteQuestPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteQuestPayload'] = ResolversParentTypes['DeleteQuestPayload']> = {
  recordId?: Resolver<ResolversTypes['GlobalId'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuestMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestMutations'] = ResolversParentTypes['QuestMutations']> = {
  create?: Resolver<ResolversTypes['CreateQuestPayload'], ParentType, ContextType, RequireFields<QuestMutationsCreateArgs, 'input'>>;
  update?: Resolver<ResolversTypes['UpdateQuestPayload'], ParentType, ContextType, RequireFields<QuestMutationsUpdateArgs, 'input'>>;
  delete?: Resolver<ResolversTypes['DeleteQuestPayload'], ParentType, ContextType, RequireFields<QuestMutationsDeleteArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type Resolvers<ContextType = any> = {
  Node?: NodeResolvers<ContextType>;
  Cursor?: GraphQLScalarType;
  ObjectId?: GraphQLScalarType;
  MultilingualString?: GraphQLScalarType;
  GlobalId?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  PersonConnection?: PersonConnectionResolvers<ContextType>;
  PersonEdge?: PersonEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  CreatePersonPayload?: CreatePersonPayloadResolvers<ContextType>;
  UpdatePersonPayload?: UpdatePersonPayloadResolvers<ContextType>;
  DeletePersonPayload?: DeletePersonPayloadResolvers<ContextType>;
  PersonMutations?: PersonMutationsResolvers<ContextType>;
  LocationType?: LocationTypeResolvers<ContextType>;
  Country?: CountryResolvers<ContextType>;
  Region?: RegionResolvers<ContextType>;
  Address?: AddressResolvers<ContextType>;
  LocationInstance?: LocationInstanceResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  LocationConnection?: LocationConnectionResolvers<ContextType>;
  LocationEdge?: LocationEdgeResolvers<ContextType>;
  CreateLocationPayload?: CreateLocationPayloadResolvers<ContextType>;
  UpdateLocationPayload?: UpdateLocationPayloadResolvers<ContextType>;
  DeleteLocationPayload?: DeleteLocationPayloadResolvers<ContextType>;
  LocationMutations?: LocationMutationsResolvers<ContextType>;
  CreateLocationInstancePayload?: CreateLocationInstancePayloadResolvers<ContextType>;
  UpdateLocationInstancePayload?: UpdateLocationInstancePayloadResolvers<ContextType>;
  DeleteLocationInstancePayload?: DeleteLocationInstancePayloadResolvers<ContextType>;
  AddArchitectPayload?: AddArchitectPayloadResolvers<ContextType>;
  RemoveArchitectPayload?: RemoveArchitectPayloadResolvers<ContextType>;
  LocationInstanceMutations?: LocationInstanceMutationsResolvers<ContextType>;
  Relation?: RelationResolvers<ContextType>;
  RelationConnection?: RelationConnectionResolvers<ContextType>;
  RelationEdge?: RelationEdgeResolvers<ContextType>;
  CreateRelationPayload?: CreateRelationPayloadResolvers<ContextType>;
  UpdateRelationPayload?: UpdateRelationPayloadResolvers<ContextType>;
  DeleteRelationPayload?: DeleteRelationPayloadResolvers<ContextType>;
  RelationMutations?: RelationMutationsResolvers<ContextType>;
  RelationType?: RelationTypeResolvers<ContextType>;
  RelationTypeEdge?: RelationTypeEdgeResolvers<ContextType>;
  RelationTypeConnection?: RelationTypeConnectionResolvers<ContextType>;
  CreateRelationTypePayload?: CreateRelationTypePayloadResolvers<ContextType>;
  UpdateRelationTypePayload?: UpdateRelationTypePayloadResolvers<ContextType>;
  DeleteRelationTypePayload?: DeleteRelationTypePayloadResolvers<ContextType>;
  RelationTypeMutations?: RelationTypeMutationsResolvers<ContextType>;
  Route?: RouteResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  EditorData?: EditorDataResolvers<ContextType>;
  Quest?: QuestResolvers<ContextType>;
  QuestConnection?: QuestConnectionResolvers<ContextType>;
  QuestEdge?: QuestEdgeResolvers<ContextType>;
  CreateQuestPayload?: CreateQuestPayloadResolvers<ContextType>;
  UpdateQuestPayload?: UpdateQuestPayloadResolvers<ContextType>;
  DeleteQuestPayload?: DeleteQuestPayloadResolvers<ContextType>;
  QuestMutations?: QuestMutationsResolvers<ContextType>;
  Long?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Timestamp?: GraphQLScalarType;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
