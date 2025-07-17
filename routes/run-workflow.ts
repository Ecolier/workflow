import { Context } from "hono";
import OpenAI from "@openai/openai";
import { Redis } from "@db/redis";

export default function runWorkflow(openAI: OpenAI, redis: Redis) {
  return async (c: Context) => {
    const workflow = await redis.get('workflow');
    if (!workflow) {
      return c.json({ error: "No workflow has been created yet" }, 400);
    }
    return c.json({ message: "Workflow is ready to run" }, 200);
  };
}
