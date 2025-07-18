import { WorkflowGraph } from "../schemas/workflow-schema.ts";

const mockWorkflowGraph: WorkflowGraph = {
  nodes: new Map([
    [
      "detect_language",
      {
        id: "detect_language",
        prompt:
          "What is the language of this message, answer with [french] if it is french or else [english]?\nMessage: {{input}}",
        routing: {
          type: "conditional",
          condition: {
            english: "summarize_en",
            french: "translate_to_en",
          },
        },
      },
    ],
    [
      "summarize_en",
      {
        id: "summarize_en",
        prompt:
          "Please summarize the following English message in a concise and professional manner:\n{{input}}",
        routing: { type: "direct", next: "reply" },
      },
    ],
    [
      "translate_to_en",
      {
        id: "translate_to_en",
        prompt:
          "Please translate the following French message to English and then provide a brief summary:\n{{input}}",
        routing: { type: "direct", next: "summarize_en" },
      },
    ],
    [
      "reply",
      {
        id: "reply",
        prompt:
          "User wants to adopt a friendly tone, reply to the following in a friendly manner: {{lastOutput}}",
        routing: { type: "terminal" },
      },
    ],
  ]),
  startNode: "detect_language",
};

export default mockWorkflowGraph;
