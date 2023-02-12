export default async function fetcher(url: RequestInfo, init?: RequestInit) {
  const res = await fetch(url, init);

  return res.json();
}
