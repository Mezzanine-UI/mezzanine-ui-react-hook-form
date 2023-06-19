/**
 * @param a 數字1
 * @param b 數字2
 * @returns 最大公因數
 */
export function gcd(a: number, b: number) {
  if (b) {
    return gcd(b, a % b);
  } else {
    return Math.abs(a);
  }
}
