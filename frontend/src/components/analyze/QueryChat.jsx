// components/QueryChat.jsx
import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

const QueryChat = ({data, token}) => {
  console.log(data);
  console.log(token);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content: "Hello! Ask anything about your analysis.",
    },
  ]);

  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;

    const msg = { id: messages.length + 1, type: "user", content: input };
    setMessages((prev) => [...prev, msg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "assistant",
          content: "This is a demo response.",
        },
      ]);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl h-[600px] flex flex-col border overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-600 p-4 text-white flex items-center">
        <MessageSquare className="w-6 h-6 mr-2" />
        Query Assistant
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl max-w-md ${
                m.type === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 p-3 border rounded-lg"
          placeholder="Ask a question..."
        />

        <button
          onClick={send}
          className="bg-emerald-600 text-white px-6 rounded-lg flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QueryChat;
