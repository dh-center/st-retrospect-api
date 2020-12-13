import mergeWith from 'lodash.mergewith';

/**
 * Merges two objects or arrays recursively
 *
 * @param original - original object
 * @param input - input object for merging with
 */
export default function mergeWithCustomizer<T, I>(original: T, input: I): T & I {
  return mergeWith(original, input, (orig, inp) => {
    if (inp === null) {
      return orig;
    }

    if (Array.isArray(inp)) {
      return inp;
    }

    return undefined;
  });
}
