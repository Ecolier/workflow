import { Context } from "hono";
import { createWorkflowSchema } from "../schemas/workflow-schemas.ts";
import { Redis } from "@db/redis";

export default function createWorkflow(redis: Redis) {
  return async (c: Context) => {
    const body = await c.req.json();
    const validation = createWorkflowSchema.safeParse(body);
    if (!validation.success) {
      return c.json({ errors: validation.error }, 400);
    }

    const workflow = validation.data;
    await redis.set('workflow', JSON.stringify(workflow));

    return new Response(null, { status: 204 });
  };
}
