/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface LogEntry {
  ts: string;
  kind: string;
  message: string;
  meta: any;
}

export interface LogsState {
  logs: LogEntry[];
  status: "idle" | "loading" | "error";
  error?: string;
}

const initialState: LogsState = {
  logs: [],
  status: "idle",
};

export const fetchLogs = createAsyncThunk("logs/fetchLogs", async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent-logs`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return (await res.json()) as {
    logs: LogEntry[];
  };
});

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    clearLogs: (state) => {
      state.logs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.status = "idle";
        state.logs = action.payload.logs;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      });
  },
});

export const { clearLogs } = logsSlice.actions;
export default logsSlice.reducer;
