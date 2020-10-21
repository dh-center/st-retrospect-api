/**
 * Object-style map with string key and T as stored type
 */
export interface ObjectMap<T> {
  [key: string]: T;
}

export type WithoutId<T> = Omit<T, '_id' | 'id'>
