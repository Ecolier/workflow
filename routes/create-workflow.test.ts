import { assertEquals } from "@std/assert";
import createRequest from "../utils/create-request.ts";
import app from "../main.ts";

// Example workflow for translation
// This is a valid workflow that can be used for testing
const translationWorkflow = new TextDecoder("utf-8").decode(
  Deno.readFileSync("./examples/translation-workflow.json")
);

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
  const request = createRequest("/create-workflow", translationWorkflow);
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
