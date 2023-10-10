import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/utils/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    // Extract the 'messages' from the body of the request
    const { messages } = await req.json();
    // Request the OpenAI API for the response based on the prompt
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: messages,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
