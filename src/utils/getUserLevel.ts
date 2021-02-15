export default function getUserLevel(exp: number): number {
  return exp ? Math.trunc(exp / 100) : 0;
}
