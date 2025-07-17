import { z } from "zod";

export const workflowNodeSchema = z.object({
  id: z.string().nonempty("Node ID is required"),
  prompt: z.string().nonempty("Prompt is required"),
  condition: z.record(
    z.string().nonempty("Condition must be a non-empty object"),
    z.string().nonempty("Condition value is required"),
  ).optional(),
  next: z.string().optional(),
});

const workflowSchema = z.object({
  nodes: workflowNodeSchema.array().nonempty("At least one node is required"),
});

export default workflowSchema;
export type Workflow = z.infer<typeof workflowSchema>;
export type WorkflowNode = z.infer<typeof workflowNodeSchema>;