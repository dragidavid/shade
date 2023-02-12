export function exists<T>(param: T | undefined | null): param is T {
  return typeof param !== "undefined" && param !== null;
}
