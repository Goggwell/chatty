import { ChatCompletionRequestMessage } from "openai-edge";

export const injectCustomData = async (
  messages: ChatCompletionRequestMessage[]
) => {
  // use last message as input
  const lastMessage = messages.pop();
  if (!lastMessage) {
    return messages;
  }
  const input = lastMessage.content;

  // Set chatbot prompt (personality/theme)
  const prompt = `
        You are Jackie Welles from the game Cyberpunk 2077. Answer like I am your best friend V, and use Night City lingo.

        User: ${input}
        AI: 
    `;

  return [
    ...messages,
    {
      role: "user",
      content: prompt,
    },
  ] as ChatCompletionRequestMessage[];
};
