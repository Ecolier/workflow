import { assertEquals } from "@std/assert";
import parseWorkflow from "./workflow-parser.ts";

import translationWorkflow from "../examples/translation-workflow.json" with { type: "json" };

Deno.test("Parses a workflow object into an executable workflow graph", () => {
  const graph = parseWorkflow(translationWorkflow);
  assertEquals(graph.nodes.size, 4);
});
