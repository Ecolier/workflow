import OpenAI from "@openai/openai";
import { Redis } from "@db/redis";
import { zValidator } from "@hono/zod-validator";
import { runWorkflowInputSchema } from "../schemas/run-workflow-schema.ts";
import executeWorkflow from "../core/workflow-executor.ts";
import { workflowGraphSchema } from "../core/schemas/workflow-schema.ts";

/**
 * Runs a workflow by validating the input schema and checking if a workflow exists in Redis.
 * @param openAI - The OpenAI client for processing the workflow.
 * @param redis - The Redis client to retrieve the workflow.
 * @returns A Hono middleware function that handles running the workflow.
 */
export default function runWorkflow(
  redis: Redis,
  openAI: OpenAI,
  openAIModel: string,
  openAITemperature: number
) {
  return zValidator(
    "json",
    runWorkflowInputSchema,
    async (parseWorkflowInput, context) => {
      if (!parseWorkflowInput.success) {
        return context.json({ errors: parseWorkflowInput.error }, 400);
      }

      const workflowGraphReply = await redis.get("workflow");
      if (!workflowGraphReply) {
        return context.json({ error: "No workflow has been created yet" }, 400);
      }

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

      const lastOutput = await executeWorkflow(
        parseWorkflowGraph.data,
        parseWorkflowInput.data.input,
        async (prompt) => {
          const response = await openAI.chat.completions.create({
            model: openAIModel,
            messages: [{ role: "user", content: prompt }],
            temperature: openAITemperature,
          });
          if (response.choices.length === 0) {
            throw new Error("No response from OpenAI");
          }
          return response.choices[0].message.content || "";
        }
      );

      return context.json({ message: lastOutput }, 200);
    }
  );
}
