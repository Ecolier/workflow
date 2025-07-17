import { Workflow, WorkflowInput, WorkflowNode } from "../schemas/workflow-schemas.ts";

export type ProcessNodeFn = (
  prompt: string,
  lastOutput: string
) => Promise<string | null>;

/**
 * Processes a workflow by executing each node in sequence.
 * @param workflow - The workflow to process.
 * @param input - The input for the workflow.
 * @param process - A function to process each node's prompt and output.
 */
export default function processWorkflow(workflow: Workflow, { input }: WorkflowInput, handleNode: ProcessNodeFn) {
  const processNode = async (currentNode: WorkflowNode) => {
    const result = await handleNode(currentNode.prompt, input);
    const nextNodeId = currentNode.next || Object.entries(currentNode.condition || {}).find(([key]) => key === result)?.[1];
    const nextNode = workflow.nodes.find((node) => node.id === nextNodeId);
    if (!nextNode) {
      console.info(`No next node found for node ${currentNode.id}, ending workflow.`);
      return;
    }
    processNode(nextNode);
  };
  processNode(workflow.nodes[0]);
}