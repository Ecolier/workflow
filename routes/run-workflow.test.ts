import { assertEquals } from "@std/assert";
import createRequest from "../test-utils/create-request.ts";
import app, { redis } from "../main.ts";

import translationInput from "../examples/translation-input.json" with { type: "json" };

const request = createRequest("/run-workflow", JSON.stringify(translationInput));

Deno.test(
  "POST /run-workflow returns 200 for successful operation",
  async () => {
    const res = await app.fetch(request);
    assertEquals(res.status, 200);
  }
);

Deno.test("POST /run-workflow returns 400 for missing workflow", async () => {
  // Clear the workflow from Redis to simulate the case where no workflow has been created
  redis.del("workflow");
  const res = await app.fetch(request);
  assertEquals(res.status, 400);
});
