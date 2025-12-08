// components/QueryChat.jsx
import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { queryResumeJd } from "../../serviceWorkers/AiServiceWorker";

const QueryChat = ({ data, token, chatHistory, setChatHistory }) => {
  const [messages, setMessages] = useState(() => {
    if (chatHistory && chatHistory.length > 0) return chatHistory;
    return [
      {
        id: 1,
        type: "assistant",
        content: "Hello! Ask anything about your resume and JD analysis.",
      },
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Update chat history whenever messages change
  const updateMessages = (newMessages) => {
    setMessages(newMessages);
    if (setChatHistory) setChatHistory(newMessages); // persist to parent
  };

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { id: messages.length + 1, type: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    updateMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        resume_emb: data.resume_emb,
        jd_emb: data.jd_emb,
        resume_text: data.resume_text,
        jd_text: data.jd_text,
        query: input,
        chat_history: updatedMessages.map((m) => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.content,
        })),
      };

      const response = await queryResumeJd(payload, token);
      const llmResponse = response?.data?.response;

      let assistantContent = "Oops! Something went wrong. Please try again later.";

      if (Array.isArray(llmResponse) && llmResponse.length > 0) {
        const firstEntry = llmResponse[0];
        if (Array.isArray(firstEntry) && firstEntry[0] === "content") {
          assistantContent = firstEntry[1];
        }
      } else if (typeof llmResponse === "string") {
        assistantContent = llmResponse;
      }

      const assistantMsg = { id: updatedMessages.length + 1, type: "assistant", content: assistantContent };
      updateMessages([...updatedMessages, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = { id: messages.length + 2, type: "assistant", content: "Error connecting to the server." };
      updateMessages([...messages, errorMsg]);
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
          <div key={m.id} className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-3 rounded-2xl max-w-md wrap-break-words whitespace-pre-wrap ${
              m.type === "user" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-800"
            }`}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl max-w-md bg-gray-100 text-gray-800 italic">Typing...</div>
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
