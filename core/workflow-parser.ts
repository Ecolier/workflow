import {
  CreateWorkflow,
  CreateWorkflowNode,
} from "../schemas/create-workflow-schema.ts";
import {
  WorkflowGraph,
  WorkflowNode,
  WorkflowNodeRouting,
} from "./schemas/workflow-schema.ts";

/**
 * Parses a CreateWorkflowNode into a NodeRouting type.
 * @param node - The workflow node to parse.
 * @returns The parsed routing structure.
 */
const parseNodeRouting = ({
  condition,
  next,
}: CreateWorkflowNode): WorkflowNodeRouting => {
  if (condition) return { type: "conditional", condition };
  if (next) return { type: "direct", next };
  return { type: "terminal" };
};

/**
 * Parses a workflow definition into a structured workflow graph.
 * @param workflow - The workflow definition to parse.
 * @returns The parsed workflow graph.
 */
export default function parseWorkflow(workflow: CreateWorkflow): WorkflowGraph {
  const nodes = new Map<string, WorkflowNode>();

  // Transform nodes into optimized structure
  for (const node of workflow.nodes) {
    const routing: WorkflowNodeRouting = parseNodeRouting(node);

    nodes.set(node.id, {
      id: node.id,
      prompt: node.prompt,
      routing,
    });
  }

  // Find start node (first node in array, or could be explicit)
  const startNode = workflow.nodes[0]?.id;
  if (!startNode) {
    throw new Error("Workflow must have at least one node");
  }

  return { nodes, startNode };
}
