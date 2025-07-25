import * as z from "zod";

export const createWorkflowNodeSchema = z.object({
  id: z.string().nonempty("Node ID is required"),
  prompt: z.string().nonempty("Prompt is required"),
  condition: z
    .record(
      z.string().nonempty("Condition must be a non-empty object"),
      z.string().nonempty("Condition value is required")
    )
    .optional(),
  next: z.string().optional(),
});

export const createWorkflowSchema = z
  .object({
    nodes: createWorkflowNodeSchema
      .array()
      .nonempty("At least one node is required"),
  })
  .check(({ value, issues }) => {
    const validIds = value.nodes.map((node) => node.id);
    value.nodes.forEach((node) => {
      if (
        (node.next && !validIds.includes(node.next)) ||
        (node.condition &&
          !Object.values(node.condition).every((value) =>
            validIds.includes(value)
          ))
      ) {
        issues.push({
          code: "custom",
          message: `Node "${node.id}" has invalid 'next' or 'condition' references`,
          input: value,
        });
      }
    });
  });

export type CreateWorkflow = z.infer<typeof createWorkflowSchema>;
export type CreateWorkflowNode = z.infer<typeof createWorkflowNodeSchema>;
