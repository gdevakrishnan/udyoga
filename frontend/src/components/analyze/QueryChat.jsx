// components/QueryChat.jsx
import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { queryResumeJd } from "../../serviceWorkers/AiServiceWorker";

const QueryChat = ({ data, token }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content: "Hello! Ask anything about your resume and JD analysis.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Safely extract assistant response from LLM nested array/object
  const extractAssistantContent = (llmResponse) => {
    try {
      if (!llmResponse) return "";
      // If it's a string, just return it
      if (typeof llmResponse === "string") return llmResponse;

      // If it's nested array like [["content", "text", {...}]]
      if (Array.isArray(llmResponse)) {
        for (let entry of llmResponse) {
          if (Array.isArray(entry) && entry[0] === "content") {
            return entry[1];
          }
        }
      }

      // fallback to JSON stringify if nothing found
      return JSON.stringify(llmResponse, null, 2);
    } catch (err) {
      console.error("Error extracting assistant content:", err);
      return "Error parsing response.";
    }
  };

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { id: messages.length + 1, type: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        resume_emb: data.resume_emb,
        jd_emb: data.jd_emb,
        resume_text: data.resume_text,
        jd_text: data.jd_text,
        query: input,
        chat_history: messages.map((m) => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.content,
        })),
      };

      const response = await queryResumeJd(payload, token);

      const llmResponse = response?.data?.response;
      const assistantContent = extractAssistantContent(llmResponse);

      // Set assistant message
      const assistantMsg = {
        id: messages.length + 2,
        type: "assistant",
        content: assistantContent,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          type: "assistant",
          content: "Error connecting to the server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
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
              className={`px-4 py-3 rounded-2xl max-w-md break-words whitespace-pre-wrap ${
                m.type === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl max-w-md bg-gray-100 text-gray-800 italic">
              Typing...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 p-3 border rounded-lg"
          placeholder="Ask a question..."
          disabled={loading}
        />
        <button
          onClick={send}
          className={`bg-emerald-600 text-white px-6 rounded-lg flex items-center gap-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QueryChat;
