import {
  OPENAI_API_KEY,
  CACHE_HOSTNAME,
  OPENAI_MODEL,
  OPENAI_TEMPERATURE,
} from "./config.ts";

import { Hono } from "hono";

import createWorkflow from "./routes/create-workflow.ts";
import runWorkflow from "./routes/run-workflow.ts";
import OpenAI from "@openai/openai";
import { connect } from "@db/redis";

import createPromptHandler from "./third-party/openai/prompt-handler.ts";

export const openAI = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const cache = await connect({
  hostname: CACHE_HOSTNAME,
  signal: () => AbortSignal.timeout(5_000),
});

const app = new Hono();

app.post("/create-workflow", createWorkflow(cache));
app.post(
  "/run-workflow",
  runWorkflow(cache, () =>
    createPromptHandler(openAI, OPENAI_MODEL, OPENAI_TEMPERATURE)
  )
);

export default app;
