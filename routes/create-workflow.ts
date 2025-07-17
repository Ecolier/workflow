import { workflowSchema } from "../schemas/workflow-schemas.ts";
import { Redis } from "@db/redis";
import { zValidator } from "@hono/zod-validator";

/**
 * Creates a new workflow by validating the input schema and storing it in Redis.
 * @param redis - The Redis client to store the workflow.
 * @returns A Hono middleware function that handles the creation of the workflow.
 */
export default function createWorkflow(redis: Redis) {
  return zValidator("json", workflowSchema, async (result, context) => {

    if (!result.success) {
      return context.json({ errors: result.error }, 400);
    }

    // Store the validated workflow in Redis
    const workflow = result.data;
    await redis.set('workflow', JSON.stringify(workflow));

    // Respond with a 204 No Content status
    return new Response(null, { status: 204 });
  });
}
