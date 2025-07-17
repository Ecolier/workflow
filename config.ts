import { cleanEnv, host, str, num } from "envalid";

export const {
  OPENAI_API_KEY,
  CACHE_HOSTNAME,
  API_HOSTNAME,
  API_PORT,
  OPENAI_MODEL,
  OPENAI_TEMPERATURE,
} = cleanEnv(Deno.env.toObject(), {
  OPENAI_API_KEY: str(),
  CACHE_HOSTNAME: host({ default: "localhost" }),
  API_HOSTNAME: host({ default: "localhost" }),
  API_PORT: str({ default: "8000" }),
  OPENAI_MODEL: str({ default: "gpt-3.5-turbo-0125" }),
  OPENAI_TEMPERATURE: num({ default: 0 }),
});
