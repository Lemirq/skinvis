"use client";

import { type CoreMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { Input } from "@/components/ui/input";
import { IoMdArrowRoundForward, IoMdChatbubbles } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/utils/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { AnalysisType } from "./sections";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Chat({
  id,
  complete,
  analysis,
  initialMessages,
}: {
  id: string;
  complete: boolean;
  analysis: AnalysisType;
  initialMessages: any[];
}) {
  const [messages, setMessages] = useState<CoreMessage[]>(initialMessages);

  const messagesRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [input, setInput] = useState("");
  useEffect(() => {
    if (!messages.length && analysis)
      setMessages([
        {
          role: "assistant",
          content: `Hello! I am SkinVis.ai, your personal skin disease assistant. I am here to help you with any skin-related questions you may have. I see that you have ${analysis?.class}, and I will do my best to assist you. If you have any questions, feel free to ask! **It is important to note that I am not a medical professional and cannot provide medical advice. If you are concerned about your skin, please consult a dermatologist for a proper diagnosis and treatment plan.**`,
        },
      ]);
  }, [analysis]);
  const supabase = createClient();

  const updateChat = async (messages: CoreMessage[]) => {
    const { data, error } = await supabase
      .from("chats")
      .upsert({ messages, id })
      .eq("id", id);
    if (error) {
      console.error(error);
      return;
    }
    console.log(data);
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: "user" },
    ];

    setMessages(newMessages);

    // either create new chat or update existing chat
    if (id) {
      await updateChat(newMessages);
    }

    setInput("");

    const result = await continueConversation(newMessages);
    let latestMessages: CoreMessage[] = [];

    for await (const content of readStreamableValue(result)) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: content as string,
        },
      ]);

      latestMessages = [
        {
          role: "system",
          content:
            "Your name is SkinVis.ai (always state your name in bold). You are a helpful AI Assistant that is specialized in helping people answer questions about SKIN DISEASES. You must be very respectful at all times, understand the user's requests, and provide accurate information and solutions at all times. If the user asks anything that is not related to Skin Disease, please state that the user is going off topic, and that you are made specifically for help with Skin Disease. YOU MUST NOT PROVIDE ANY INFORMATION THAT IS NOT RELATED TO Skin Disease, INSTEAD SAY THAT YOU ARE NOT PROGRAMMED TO HELP WITH THAT TOPIC. Do not state that you are not a doctor, as its already said in the first message",
        },
        ...newMessages,
        {
          role: "assistant",
          content: content as string,
        },
      ];
      if (id) {
        await updateChat([
          ...newMessages,
          {
            role: "assistant",
            content: content as string,
          },
        ]);
      }
    }
  };

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full py-7 mx-auto h-full fc relative"
        >
          Please start an analysis on the left to start chat.
        </motion.div>
      )}
      {complete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fc w-full py-7 mx-auto h-full relative"
        >
          <div className="fc justify-start items-start px-3 gap-10 w-full pb-24 overflow-y-auto h-full">
            {messages &&
              messages.map((m, i) => {
                if (m.role === "system") return null;
                return (
                  <div
                    key={i}
                    className="w-full fr gap-2 justify-start items-start"
                  >
                    {m.role === "user" ? (
                      <IoPerson className="text-2xl" />
                    ) : (
                      <FaRobot className="text-2xl" />
                    )}
                    <div
                      key={i}
                      className="whitespace-pre-wrap text-base w-full"
                    >
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              className=""
                              {...props}
                              target="_blank"
                              rel="noreferrer noopener"
                            />
                          ),
                        }}
                      >
                        {m.content as string}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="h-1 w-full" ref={messagesRef} />

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="absolute py-2 sm:py-10 bottom-0 bg-gradient-to-t from-black from-75% to-transparent max-w-xl w-full px-3 fr gap-2 text-3xl">
              <label htmlFor="user">
                <IoMdChatbubbles />
              </label>

              <Input
                className="w-full text-base"
                value={input}
                placeholder="Ask for help..."
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit">
                <IoMdArrowRoundForward />
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
