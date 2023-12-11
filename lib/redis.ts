import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: "https://eu1-valid-malamute-39183.upstash.io",
  token: process.env.UPSTASH_REDIS_TOKEN!,
});
