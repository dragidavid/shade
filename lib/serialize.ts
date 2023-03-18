import type { Snippet } from "@prisma/client";

function serializeDates<T>(_: string, value: T) {
  if (value instanceof Date) {
    return (value as Date).toJSON();
  }

  return value;
}

export function serialize(snippets: Snippet[]) {
  const serializedObject = JSON.stringify(snippets, serializeDates);

  return JSON.parse(serializedObject) as Snippet[];
}
