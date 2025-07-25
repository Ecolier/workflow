import { createWorkflowSchema } from "../schemas/create-workflow-schema.ts";
import { zValidator } from "@hono/zod-validator";
import parseWorkflow from "../core/workflow-parser.ts";
import Cache from "../types/cache.ts";

/**
 * Creates a new workflow by validating the input schema and storing it in Redis.
 * @param redis - The Redis client to store the workflow.
 * @returns A Hono middleware function that handles the creation of the workflow.
 */
export default function createWorkflow(cache: Cache) {
  return zValidator("json", createWorkflowSchema, async (result, context) => {
    if (!result.success) {
      return context.json({ errors: result.error }, 400);
    }

    // Store the validated and execution-ready workflow graph in Redis
    const workflowGraph = parseWorkflow(result.data);
    await cache.set(
      "workflow",
      JSON.stringify({
        ...workflowGraph,
        nodes: Array.from(workflowGraph.nodes.entries()),
      })
    );

    // Respond with a 204 No Content status
    return new Response(null, { status: 204 });
  });
}
