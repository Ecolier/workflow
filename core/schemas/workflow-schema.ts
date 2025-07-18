import * as z from "zod";

export const workflowNodeRoutingSchema = z.union([
  z.object({
    type: z.literal("conditional"),
    condition: z.record(z.string(), z.string()),
  }),
  z.object({
    type: z.literal("direct"),
    next: z.string(),
  }),
  z.object({
    type: z.literal("terminal"),
  }),
]);

export const workflowNodeSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  routing: workflowNodeRoutingSchema,
});

export const workflowGraphSchema = z.object({
  nodes: z.map(z.string(), workflowNodeSchema),
  startNode: z.string(),
});

export type WorkflowGraph = z.infer<typeof workflowGraphSchema>;
export type WorkflowNode = z.infer<typeof workflowNodeSchema>;
export type WorkflowNodeRouting = z.infer<typeof workflowNodeRoutingSchema>;
