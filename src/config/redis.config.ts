import { createClient } from "redis";
import { envConfig } from "./envConfig";

export const redisClient = createClient({
  url: envConfig.REDIS_ENDPOINT,
});

export const connectRedis = async () => {
  try {
    redisClient.connect();
    // redisClient.connect().catch(console.error);
  } catch (error) {
    console.log(error);
  }
};
