"use client";

import type React from "react";
import { useChat } from "@ai-sdk/react";
import { useOnlineStatus } from "@/hooks/use-online-status";

// A VERY simplified version for debugging
export default function EnhancedAIChatInterface() {
const isOnline = useOnlineStatus();
  const { messages, input, setInput, handleSubmit } = useChat({
    api: "/api/v1/chat",
  });

  return (
    <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'white', border: '1px solid black', padding: '10px', zIndex: 1000 }}>
      <h3>Debug Chat</h3>
        <p className="text-xs font-bold">Status: {isOnline ? "Online" : "Offline"}</p>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', marginBottom: '10px' }}>
        {messages.map(m => (
          <div key={m.id}>
            <strong>{m.role}: </strong>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          style={{ width: '100%', border: '1px solid black' }}
        />
        <button type="submit" style={{ width: '100%' }}>Send</button>
      </form>
    </div>
  );
}