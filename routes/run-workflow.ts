import OpenAI from "@openai/openai";
import { Redis } from "@db/redis";
import { zValidator } from "@hono/zod-validator";
import { workflowInputSchema, workflowSchema } from "../schemas/workflow-schemas.ts";

/**
 * Runs a workflow by validating the input schema and checking if a workflow exists in Redis.
 * @param openAI - The OpenAI client for processing the workflow.
 * @param redis - The Redis client to retrieve the workflow.
 * @returns A Hono middleware function that handles running the workflow.
 */
export default function runWorkflow(openAI: OpenAI, redis: Redis) {
  return zValidator("json", workflowInputSchema, async (result, context) => {
    
    if (!result.success) {
      return context.json({ errors: result.error }, 400);
    }

    const workflow = await redis.get("workflow");
    if (!workflow) {
      return context.json({ error: "No workflow has been created yet" }, 400);
    }

    const parseResult = workflowSchema.safeParse(JSON.parse(workflow));
    if (!parseResult.success) {
      return context.json(
        { error: "Invalid workflow schema", issues: parseResult.error.issues },
        400
      );
    }

    return context.json({ message: "Workflow is ready to run" }, 200);
  });
}
