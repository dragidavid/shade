export function find<T extends object>(a: T[], k: string): T {
  const match = a.find((item) => "id" in item && item.id === k);

  if (match) {
    return match!;
  }

  return a.at(0)!;
}
