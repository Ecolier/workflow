import { assertEquals } from "@std/assert";
import app from "../main.ts";

Deno.test("POST /create-workflow returns 204", async () => {
  const body = new TextDecoder("utf-8").decode(Deno.readFileSync("./examples/translation-workflow.json"));
  const request = new Request("http://localhost:8000/create-workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  });
  const res = await app.fetch(request);
  assertEquals(res.status, 204);
});
