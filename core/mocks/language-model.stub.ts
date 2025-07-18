type OpenAIResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
};

const replies = [
  "Here's what you asked for!",
  "Here's the information you need.",
  "I've processed your request.",
  "This is the output you requested.",
  "Here's the result of your query.",
  "I've completed the task.",
];

/**
 * Mock OpenAI client for testing purposes.
 * This simulates the OpenAI API response for a given prompt.
 * It randomly selects a response from a predefined set of replies.
 * If the prompt contains conditions in square brackets, it randomly selects one of those conditions.
 */
const create = async (prompt: string): Promise<OpenAIResponse> =>
  await new Promise((resolve) => {
    const matchedConditions = [...prompt.matchAll(/[\[](.*?)[\]]/g)].map(
      (m) => m[1]
    );
    resolve({
      choices: [
        {
          message: {
            content:
              matchedConditions.length > 0
                ? matchedConditions[
                    Math.floor(Math.random() * matchedConditions.length)
                  ]
                : replies[Math.floor(Math.random() * replies.length)],
          },
        },
      ],
    });
  });

export const fakeOpenAI = {
  chat: {
    completions: {
      create,
    },
  },
};

export default fakeOpenAI;
