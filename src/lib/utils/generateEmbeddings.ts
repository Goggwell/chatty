import { getDocuments } from "./getDocuments";
import { openai } from "./openai";
import { supabase } from "./supabase";

export async function generateEmbeddings() {
  const documents = await getDocuments();
  for (const document of documents) {
    // OpenAI recommends replacing newlines with spaces for best results
    const input = document.pageContent.replace(/\n/g, " ");
    try {
      const embeddingResponse = await (
        await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input,
        })
      ).json();
      const [{ embedding }] = embeddingResponse.data;
      // In production we should handle possible errors
      await supabase.from("documents").insert({
        content: input,
        embedding,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

generateEmbeddings();
