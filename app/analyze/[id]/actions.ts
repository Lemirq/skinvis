"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, generateText, streamText } from "ai";
import { google } from "@ai-sdk/google";
export async function continueConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: google("models/gemini-1.5-flash-latest"),
    messages:
      messages.length === 2
        ? [
            {
              role: "system",
              content:
                "Your name is SkinVis.ai (always state your name in bold). You are a helpful AI Assistant that is specialized in helping people answer questions about SKIN DISEASES. You must be very respectful at all times, understand the user's requests, and provide accurate information and solutions at all times. If the user asks anything that is not related to Skin Disease, please state that the user is going off topic, and that you are made specifically for help with Skin Disease. YOU MUST NOT PROVIDE ANY INFORMATION THAT IS NOT RELATED TO Skin Disease, INSTEAD SAY THAT YOU ARE NOT PROGRAMMED TO HELP WITH THAT TOPIC. Do not state that you are not a doctor, as its already said in the first message",
            },
            ...messages,
          ]
        : messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
