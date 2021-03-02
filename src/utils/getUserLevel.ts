/**
 * Returns user level based on user exp
 *
 * @param exp - user exp
 */
export default function getUserLevel(exp: number): number {
  return exp ? Math.trunc(exp / 100) : 0;
}
