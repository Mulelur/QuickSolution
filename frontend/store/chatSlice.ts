import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessagePart {
  type: string;
  text?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  parts: ChatMessagePart[];
}

interface ChatState {
  messages: ChatMessage[];
  status: "idle" | "submitted" | "streaming";
}

const initialState: ChatState = {
  messages: [],
  status: "idle",
};

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async (args: { text: string; files?: File[] }) => {
    const body = JSON.stringify({
      query: args.text,
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ai-assistant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }
    );

    if (!res.ok) {
      console.error("API ERROR", await res.text());
      throw new Error("API request failed");
    }

    const apiResponse = await res.json();

    return {
      id: crypto.randomUUID(),
      role: "assistant",
      parts: [
        {
          type: "text",
          text: apiResponse.answer ?? JSON.stringify(apiResponse),
        },
      ],
    } as ChatMessage;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    regenerate: (state) => {
      state.status = "submitted";
    },
    clearChat: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.status = "submitted";
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.status = "idle";
        state.messages.push(action.payload);
      });
  },
});

export const { addUserMessage, regenerate, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
