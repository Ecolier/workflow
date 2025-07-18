import OpenAI from "@openai/openai";
import { Redis } from "@db/redis";
import { zValidator } from "@hono/zod-validator";
import { runWorkflowInputSchema } from "../schemas/run-workflow-schema.ts";
import executeWorkflow from "../core/workflow-executor.ts";
import { workflowGraphSchema } from "../core/schemas/workflow-schema.ts";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Initialize an array to hold chat messages for the workflow execution
// This will be used to maintain the conversation context with OpenAI
const messages: ChatMessage[] = [];

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

      // Check if the workflow graph exists in Redis
      const workflowGraphReply = await redis.get("workflow");
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

      // Execute the workflow with the provided input and prompt handling function
      const lastOutput = await executeWorkflow(
        parseWorkflowGraph.data,
        parseWorkflowInput.data.input,
        async (prompt) => {
          messages.push({ role: "user", content: prompt });

          // Call OpenAI API with the prompt
          const chatCompletion = await openAI.chat.completions.create({
            model: openAIModel,
            messages,
            temperature: openAITemperature,
          });
          if (chatCompletion.choices.length === 0) {
            throw new Error("No response from OpenAI");
          }
          const responseMessage =
            chatCompletion.choices[0].message.content || "";
          console.log("OpenAI response:", responseMessage);
          messages.push({ role: "assistant", content: responseMessage });
          return responseMessage;
        }
      );

      return context.json({ message: lastOutput }, 200);
    }
  );
}
