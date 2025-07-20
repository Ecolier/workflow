import { zValidator } from "@hono/zod-validator";
import { runWorkflowInputSchema } from "../schemas/run-workflow-schema.ts";
import executeWorkflow from "../core/workflow-executor.ts";
import { workflowGraphSchema } from "../core/schemas/workflow-schema.ts";
import Cache from "../types/cache.ts";

/**
 * Runs a workflow by validating the input schema and checking if a workflow exists in Redis.
 * @param openAI - The OpenAI client for processing the workflow.
 * @param redis - The Redis client to retrieve the workflow.
 * @returns A Hono middleware function that handles running the workflow.
 */
export default function runWorkflow(
  cache: Cache,
  createPromptHandler: () => (prompt: string) => Promise<string>,
) {
  return zValidator(
    "json",
    runWorkflowInputSchema,
    async (parseWorkflowInput, context) => {
      if (!parseWorkflowInput.success) {
        return context.json({ errors: parseWorkflowInput.error }, 400);
      }

      // Check if the workflow graph exists in Redis
      const workflowGraphReply = await cache.get("workflow");
      if (!workflowGraphReply) {
        return context.json({ error: "No workflow has been created yet" }, 400);
      }

      // Parse the workflow graph from Redis
      // The workflow graph is expected to be a JSON string with nodes as a Map
      // Convert the JSON string to an object and then to a Map for nodes
      const parseWorkflowGraph = workflowGraphSchema.safeParse({
        ...JSON.parse(workflowGraphReply),
        nodes: new Map(JSON.parse(workflowGraphReply).nodes),
      });

      if (!parseWorkflowGraph.success) {
        return context.json(
          {
            error: "Invalid workflow schema",
            issues: parseWorkflowGraph.error.issues,
          },
          400
        );
      }

      const handlePrompt = createPromptHandler();

      // Execute the workflow with the provided input and prompt handling function
      const lastOutput = await executeWorkflow(
        parseWorkflowGraph.data,
        parseWorkflowInput.data.input,
        handlePrompt,
      );

      return context.json({ message: lastOutput }, 200);
    }
  );
}
