import * as z from "zod";

export const runWorkflowInputSchema = z.object({
  input: z.string().nonempty("Input is required"),
});

export type RunWorkflowInput = z.infer<typeof runWorkflowInputSchema>;
