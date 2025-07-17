import { cleanEnv, host, str } from "envalid";

export const { OPENAI_API_KEY, CACHE_HOSTNAME, API_HOSTNAME, API_PORT } = cleanEnv(Deno.env.toObject(), {
  OPENAI_API_KEY: str(),
  CACHE_HOSTNAME: host({ default: "localhost" }),
  API_HOSTNAME: host({ default: "localhost" }),
  API_PORT: str({ default: "8000" }),
});
