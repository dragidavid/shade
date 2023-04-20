export function random(
  min: number,
  max: number,
  isWholeNumber: boolean = true
): number {
  const n = Math.random() * (max - min) + min;

  if (isWholeNumber) {
    return Math.floor(n);
  }

  return n;
}
