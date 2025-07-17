import processWorkflow from "./process-workflow.ts";

const translationWorkflow = new TextDecoder("utf-8").decode(
  Deno.readFileSync("./examples/translation-workflow.json")
);

const translationInput = new TextDecoder("utf-8").decode(
  Deno.readFileSync("./examples/translation-input.json")
);

Deno.test(
  "Processing workflow with valid input",
  () => {
    processWorkflow(
      JSON.parse(translationWorkflow),
      JSON.parse(translationInput),
      async (prompt, lastOutput) => {
        return await new Promise((resolve) => {
          resolve("english");
        });
      }
    );
  }
);