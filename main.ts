import { Hono } from "hono";
import createWorkflow from "./routes/create-workflow.ts";
import runWorkflow from "./routes/run-workflow.ts";
import { cleanEnv, host, str } from "envalid";
import OpenAI from "@openai/openai";
import { connect } from "@db/redis";

const { OPENAI_API_KEY, CACHE_HOSTNAME } = cleanEnv(Deno.env.toObject(), {
  OPENAI_API_KEY: str(),
  CACHE_HOSTNAME: host({ default: "localhost" }),
});

const openAI = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const redis = await connect({
  hostname: CACHE_HOSTNAME,
  signal: () => AbortSignal.timeout(5_000),
});

const app = new Hono();

app.post("/create-workflow", createWorkflow(redis));
app.post("/run-workflow", runWorkflow(openAI, redis));

export default app;
