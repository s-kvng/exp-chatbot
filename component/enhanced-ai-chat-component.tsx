"use client";

import React, { useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

// A VERY simplified version for debugging
export default function EnhancedAIChatInterface() {
  const toastIdRef = useRef<string | number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isOnline = useOnlineStatus();
  const { messages, input, setInput, handleSubmit, error } = useChat({
    api: "/api/v1/chat",
  });

  useEffect(() => {
    const cleanup = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    if (!isOnline) {
      if (!toastIdRef.current) {
        toastIdRef.current = toast.loading("Reconnecting...", {
          duration: Number.POSITIVE_INFINITY,
        });
      }

      cleanup();
      timeoutRef.current = setTimeout(() => {
        if (!isOnline && toastIdRef.current) {
          toast.error("You are offline. Please check your connection.", {
            id: toastIdRef.current,
            duration: 5000,
          });
          toastIdRef.current = null;
        }
      }, 50000);
    } else if (toastIdRef.current) {
      cleanup();
      toast.success("Reconnected", {
        id: toastIdRef.current,
        duration: 2000,
      });
      toastIdRef.current = null;
    }

    return cleanup;
  }, [isOnline]);

  const parsedErrorMessage = (() => {
    if (!error) return null;

    console.error("Chat Error:", error); // Log the full error object to the console

    try {
      // Attempt to parse a JSON message
      const parsed = JSON.parse(error.message);
      return parsed.error || "An unexpected error occurred.";
    } catch {
      console.log("error ", error);
      // Fallback to the raw error message
      return error.message || "An unexpected error occurred.";
    }
  })();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "white",
        border: "1px solid black",
        padding: "10px",
        zIndex: 1000,
      }}
    >
      <h3>Debug Chat</h3>
      <p className="text-xs font-bold">
        Status: {isOnline ? "Online" : "Offline"}
      </p>
      {parsedErrorMessage && (
        <p className="text-red-500 text-xs">Error: {parsedErrorMessage}</p>
      )}
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      >
        {messages.map((m) => (
          <div key={m.id}>
            <strong>{m.role}: </strong>
            <span>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          style={{ width: "100%", border: "1px solid black" }}
        />
        <button type="submit" style={{ width: "100%" }}>
          Send
        </button>
      </form>
    </div>
  );
}
