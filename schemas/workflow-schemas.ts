import { string, z } from "zod";

export const createWorkflowNodeSchema = z.object({
  id: z.string().nonempty("Node ID is required"),
  prompt: z.string().nonempty("Prompt is required"),
  condition: z.record(
    z.string().nonempty("Condition must be a non-empty object"),
    z.string().nonempty("Condition value is required"),
  ).optional(),
  next: z.string().optional(),
});

export const createWorkflowSchema = z.object({
  nodes: createWorkflowNodeSchema.array().nonempty("At least one node is required"),
});

export const runWorkflowSchema = z.object({
  input: string().nonempty("Input is required"),
});

export type CreateWorkflow = z.infer<typeof createWorkflowSchema>;
export type CreateWorkflowNode = z.infer<typeof createWorkflowNodeSchema>;
export type RunWorkflow = z.infer<typeof runWorkflowSchema>;