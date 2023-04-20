import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: "https://shade.dragi.me/sitemap.xml",
    host: "https://shade.dragi.me",
  };
}
