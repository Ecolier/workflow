import { Context } from "hono";
import workflowSchema from "../schemas/workflow-schema.ts";
import OpenAI from "@openai/openai";
import { Redis } from "@db/redis";

export default function createWorkflow(openAI: OpenAI, redis: Redis) {
  return async (c: Context) => {
    const body = await c.req.json();
    const validation = workflowSchema.safeParse(body);
    if (!validation.success) {
      return c.json({ errors: validation.error }, 400);
    }

    const workflow = validation.data;

    // Create the workflow using the provided name and steps
    return c.json({
      message: "Workflow created successfully",
      workflow: { ...workflow },
    });
  };
}
