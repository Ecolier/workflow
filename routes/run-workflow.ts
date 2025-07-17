import OpenAI from "@openai/openai";
import { Redis } from "@db/redis";
import { zValidator } from "@hono/zod-validator";
import { workflowInputSchema, WorkflowNode, workflowSchema } from "../schemas/workflow-schemas.ts";
import processWorkflow from "../services/process-workflow.ts";

/**
 * Runs a workflow by validating the input schema and checking if a workflow exists in Redis.
 * @param openAI - The OpenAI client for processing the workflow.
 * @param redis - The Redis client to retrieve the workflow.
 * @returns A Hono middleware function that handles running the workflow.
 */
export default function runWorkflow(redis: Redis, openAI: OpenAI, openAIModel: string, openAITemperature: number) {
  return zValidator("json", workflowInputSchema, async (result, context) => {

    if (!result.success) {
      return context.json({ errors: result.error }, 400);
    }

    const workflowReply = await redis.get("workflow");
    if (!workflowReply) {
      return context.json({ error: "No workflow has been created yet" }, 400);
    }

    const parseResult = workflowSchema.safeParse(JSON.parse(workflowReply));
    if (!parseResult.success) {
      return context.json(
        { error: "Invalid workflow schema", issues: parseResult.error.issues },
        400
      );
    }

    processWorkflow(parseResult.data, result.data, async (prompt, lastOutput) => {
      const response = await openAI.chat.completions.create({
        model: openAIModel,
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: lastOutput },
        ],
        temperature: openAITemperature,
      });
      return response.choices[0].message.content;
    });

    return context.json({ message: "Workflow is ready to run" }, 200);
  });
}
