export async function fetcher(url: RequestInfo, init?: RequestInit) {
  const res = await fetch(url, init);

  if (!res.ok) {
    const error = new Error();

    const { message } = await res.json();

    error.message = message;

    throw error;
  }

  return res.json();
}
