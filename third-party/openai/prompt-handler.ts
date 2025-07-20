import OpenAI from "@openai/openai";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default function createPromptHandler(
  openAI: OpenAI,
  model: string,
  temperature: number
) {
  // Create a message history to maintain context
  // This will be used to send the conversation history to OpenAI
  // and to receive the next message in the conversation.
  const messages: ChatMessage[] = [];

  return async (prompt: string) => {
    messages.push({ role: "user", content: prompt });

    // Call OpenAI API with the prompt
    const chatCompletion = await openAI.chat.completions.create({
      model: model,
      messages,
      temperature: temperature,
    });

    if (chatCompletion.choices.length === 0) {
      throw new Error("No response from OpenAI");
    }

    const responseMessage = chatCompletion.choices[0].message.content || "";
    console.log("OpenAI response:", responseMessage);
    messages.push({ role: "assistant", content: responseMessage });

    return responseMessage;
  };
}
