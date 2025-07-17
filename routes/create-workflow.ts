import { Context } from "hono";
import { workflowSchema } from "../schemas/workflow-schemas.ts";
import { Redis } from "@db/redis";

export default function createWorkflow(redis: Redis) {
  return async (c: Context) => {
    const body = await c.req.json();

    // If validation fails, return a 400 Bad Request with the error details
    const validation = workflowSchema.safeParse(body);
    if (!validation.success) {
      return c.json({ errors: validation.error }, 400);
    }

    // Store the validated workflow in Redis
    const workflow = validation.data;
    await redis.set('workflow', JSON.stringify(workflow));

    // Respond with a 204 No Content status
    return new Response(null, { status: 204 });
  };
}
