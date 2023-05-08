import { useStore } from "lib/store";

export async function fetcher(url: RequestInfo, init?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const body = await res.json();

  const update = useStore.getState().update;

  if (!res.ok) {
    const { code } = body;

    if (!code) {
      update("message", "UNKNOWN_ERROR");

      throw new Error("UNKNOWN_ERROR");
    }

    update("message", code);

    throw new Error(code);
  }

  return body;
}
