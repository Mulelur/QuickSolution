"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { useState } from "react";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { Loader } from "@/components/ai-elements/loader";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { addUserMessage, sendChatMessage, regenerate } from "@/store/chatSlice";

export default function ChatBotDemo() {
  const dispatch = useDispatch<AppDispatch>();

  const messages = useSelector((state: RootState) => state.chat.messages);
  const status = useSelector((state: RootState) => state.chat.status);

  const [input, setInput] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (message: { text: any; files: File[] }) => {
    const hasText = Boolean(message.text);
    if (!hasText) return;

    // add the user message to Redux
    dispatch(
      addUserMessage({
        id: crypto.randomUUID(),
        role: "user",
        parts: [{ type: "text", text: message.text }],
      })
    );

    dispatch(
      sendChatMessage({
        text: message.text,
        files: message.files,
      })
    );

    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full  h-[calc(100vh-120px)]">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.parts?.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <Message key={`${message.id}-${i}`} from={message.role}>
                        <MessageContent>
                          <MessageResponse>{part.text}</MessageResponse>
                        </MessageContent>

                        {message.role === "assistant" &&
                          message.id === messages.at(-1)?.id && (
                            <MessageActions>
                              <MessageAction
                                onClick={() => dispatch(regenerate())}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text!)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                      </Message>
                    );
                  }
                })}
              </div>
            ))}

            {status === "submitted" && <Loader />}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        {/* Prompt */}
        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4"
          multiple
          globalDrop
        >
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
