import { ObjectId } from 'mongodb';
import { base64, unbase64 } from './base64';
import { NodeName } from '../types/graphql';

/**
 * Converts unique type name and unique id for that type name to unique global id
 *
 * @param type - type for encoding
 * @param id - id for encoding
 */
export function toGlobalId(type: NodeName, id: ObjectId): string {
  return base64(`${type}:${id}`);
}

/**
 * Decoded representation of the global id
 */
interface DecodedGlobalId {
  /**
   * Unique type name
   */
  type: NodeName;

  /**
   * Unique object id for provided typename
   */
  id: ObjectId;
}

/**
 * Decodes global id and returns its decoded representation
 *
 * @param id - id to decode
 */
export function fromGlobalId(id: string): DecodedGlobalId {
  const [type, objectId] = unbase64(id).split(':') as [NodeName, string];

  return {
    type,
    id: new ObjectId(objectId),
  };
}
