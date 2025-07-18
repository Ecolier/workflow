import executeWorkflow from "./workflow-executor.ts";

import mockWorkflowGraph from "./mocks/workflow-graph.mock.ts";
import fakeOpenAI from "./mocks/language-model.stub.ts";
import { assertGreater } from "@std/assert/greater";

Deno.test(
  "Executes a translation, summarization and reply workflow",
  async () => {
    const finalOutput = await executeWorkflow(
      mockWorkflowGraph,
      "Hello world",
      async (prompt) => {
        const response = await fakeOpenAI.chat.completions.create(prompt);
        return response.choices[0].message.content!;
      }
    );
    assertGreater(finalOutput.length, 0);
  }
);
