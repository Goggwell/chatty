import { openai } from "@/lib/utils/openai";
import { supabase } from "@/lib/utils/supabase";
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

  // Perform similarity search against embeddings
  const embeddingResponse = await (
    await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: input!,
    })
  ).json();
  const [{ embedding }] = embeddingResponse.data;
  const { data: documents } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.78,
    match_count: 10,
  });

  // Context for answer provided against query
  let contextText = "";
  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    const content = document.content;
    contextText += `${content.trim()}---\n`;
  }

  // Set chatbot prompt (personality/theme)
  const prompt = `
        You are Jackie Welles from the game Cyberpunk 2077. Answer like I am your best friend V, and use Night City lingo.
        Context: ${contextText}
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
