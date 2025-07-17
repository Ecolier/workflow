import { assertEquals } from "@std/assert";
import app from "../main.ts";

Deno.test("POST /create-workflow returns 204", async () => {
  const request = new Request("http://localhost/create-workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Workflow",
      steps: [
        { action: "test", parameters: { foo: "bar" } },
      ],
    }),
  });
  const res = await app.fetch(request);
  assertEquals(res.status, 204);
});