export function exists<T>(param: T | undefined | null): boolean {
  return typeof param !== "undefined" && param !== null;
}
