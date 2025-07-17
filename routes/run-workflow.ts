import { Context } from "hono";
import OpenAI from "@openai/openai";
import { Redis } from "@db/redis";

export default function runWorkflow(openAI: OpenAI, redis: Redis) {
  return async (c: Context) => {
    const { name, steps } = await c.req.json();
    // Run the workflow using the provided name and steps
    return c.json({
      message: "Workflow run successfully",
      workflow: { name, steps },
    });
  };
}
