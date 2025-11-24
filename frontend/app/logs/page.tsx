"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogs } from "@/store/logsSlice";
import type { RootState, AppDispatch } from "@/store";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function LogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const logs = useSelector((s: RootState) => s.logs.logs);
  const status = useSelector((s: RootState) => s.logs.status);

  const containerRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  // Track scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const isBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      setAtBottom(isBottom);
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToPosition = () => {
    const container = containerRef.current;
    if (!container) return;

    if (atBottom) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  };

  if (status === "loading")
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="relative p-6 space-y-4">
      <h1 className="text-2xl font-bold">Agent Logs</h1>

      <div
        ref={containerRef}
        className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-[70vh]"
      >
        <pre>{JSON.stringify(logs, null, 2)}</pre>
      </div>

      <Button
        onClick={scrollToPosition}
        className="fixed bottom-6 right-6 rounded-full p-3 shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        {atBottom ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
      </Button>
    </div>
  );
}
