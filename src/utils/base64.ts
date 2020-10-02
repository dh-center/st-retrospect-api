/**
 * Encodes string to base64
 *
 * @param i - value to encode
 */
export function base64(i: string): string {
  return ((Buffer.from(i, 'ascii')).toString('base64'));
}

/**
 * Decodes string from base64
 *
 * @param i - value to decode
 */
export function unbase64(i: string): string {
  return ((Buffer.from(i, 'base64')).toString('ascii'));
}
