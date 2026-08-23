import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../../lib/api";
import { Send, Bot, User } from "lucide-react";

interface LocalMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await sendMessage({ message: text, conversation_id: conversationId });
      setConversationId(res.conversation_id);
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    } catch {
      setError("Could not reach the backend. Make sure the server is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div>
          <h2 className="page-title" style={{ fontSize: "18px" }}>Chat</h2>
          <p className="page-subtitle">Send a message to AIRA</p>
        </div>
        <span className="chat-mode-badge">Mock mode — Ollama next</span>
      </div>

      {/* Message list */}
      <div className="chat-messages">
        {messages.length === 0 && !loading && (
          <div className="chat-empty">
            <Bot size={40} style={{ color: "var(--cyan-core)", marginBottom: "12px" }} />
            <p>Start a conversation with AIRA.</p>
            <p style={{ fontSize: "12px", marginTop: "6px" }}>
              Placeholder replies are saved to SQLite. Ollama integration is next.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble-row ${msg.role}`}>
            <div className="chat-avatar">
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`chat-bubble ${msg.role}`}>
              <span className="chat-role-label">
                {msg.role === "user" ? "You" : "AIRA"}
              </span>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble-row assistant">
            <div className="chat-avatar">
              <Bot size={16} />
            </div>
            <div className="chat-bubble assistant chat-thinking">
              <span className="chat-role-label">AIRA</span>
              <div className="thinking-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="chat-error">
            <span>⚠ {error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <textarea
          className="chat-input"
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={loading}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!input.trim() || loading}
          title="Send"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
