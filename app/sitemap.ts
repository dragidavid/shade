import { MetadataRoute } from "next";

import { prisma } from "lib/prisma";

async function getSnippets() {
  return await prisma.snippet.findMany({
    select: {
      id: true,
      createdAt: true,
    },
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const snippets = await getSnippets();

  let routes: { url: string; lastModified: Date }[] = [];

  if (snippets) {
    routes = snippets.map((snippet) => ({
      url: `https://shade.dragi.me/${snippet.id}`,
      lastModified: new Date(snippet.createdAt),
    }));
  }

  return [
    {
      url: "https://shade.dragi.me",
      lastModified: new Date(),
    },
    {
      url: "https://shade.dragi.me/dashboard",
      lastModified: new Date(),
    },
    ...routes,
  ];
}
