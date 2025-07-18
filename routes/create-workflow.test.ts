import { assertEquals } from "@std/assert";
import createRequest from "../test-utils/create-request.ts";
import app from "../main.ts";

import translationWorkflow from "../examples/translation-workflow.json" with { type: "json" };

// Invalid workflow example with unreferenced node
// The 'pick_numbers' node is not referenced in the workflow
const invalidWorkflow = {
  nodes: [
    {
      id: "start",
      prompt: "Translate the following text: {{input}}",
      next: "pick_numbers",
    },
    {
      id: "summerize",
      prompt: "Summarize the following text: {{lastOutput}}",
    },
  ],
};

Deno.test("POST /create-workflow returns 204 for valid request", async () => {
  const request = createRequest("/create-workflow", JSON.stringify(translationWorkflow));
  const res = await app.fetch(request);
  assertEquals(res.status, 204);
});

Deno.test("POST /create-workflow returns 400 for invalid request", async () => {
  const request = createRequest(
    "/create-workflow",
    JSON.stringify(invalidWorkflow)
  );
  const res = await app.fetch(request);
  assertEquals(res.status, 400);
});
