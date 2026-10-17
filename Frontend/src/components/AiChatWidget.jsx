import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import "../styles/AiChatWidget.css";

const starterMessage = {
  role: "assistant",
  text: "Hi! I’m your Student Management AI assistant. Ask me about courses, attendance, marks, study plans, or how to use this system.",
};

function getErrorMessage(error) {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const serverMessage = typeof data === "string" ? data : data?.message;

  if (status === 401) return "Your login session may have expired. Please log in again.";
  if (status === 403) return "Your session was not authorized. Please log out, log in again, and retry.";
  if (status === 429) return serverMessage || "The AI usage or rate limit has been reached. Check the backend API billing and usage limits.";
  if (status === 503) return serverMessage || "AI is not configured. Set OPENAI_API_KEY in the backend environment and restart Spring Boot.";
  if (status === 502) return serverMessage || "The AI provider could not answer. Check the API key, quota, and internet connection.";
  if (serverMessage) return serverMessage;
  return "Could not connect to the backend. Make sure Spring Boot is running on http://localhost:8080.";
}

export default function AiChatWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([starterMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Keep the assistant hidden on the login screen.
  if (location.pathname === "/login" || !localStorage.getItem("token")) return null;

  async function sendMessage(event) {
    event?.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setError("");
    setInput("");
    setMessages((current) => [...current, { role: "user", text: question }]);
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", { message: question });
      const reply = response?.data?.reply;
      if (typeof reply !== "string" || !reply.trim()) {
        throw new Error("The backend returned an empty AI response.");
      }
      setMessages((current) => [...current, { role: "assistant", text: reply.trim() }]);
    } catch (requestError) {
      setError(requestError.message === "The backend returned an empty AI response."
        ? requestError.message
        : getErrorMessage(requestError));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function clearChat() {
    setMessages([starterMessage]);
    setError("");
  }

  return (
    <div className="ai-chat-root">
      {isOpen && (
        <section className="ai-chat-panel" aria-label="AI chat assistant">
          <header className="ai-chat-header">
            <div className="ai-chat-brand-icon" aria-hidden="true">✦</div>
            <div className="ai-chat-header-copy">
              <strong>Student AI Assistant</strong>
              <span><i /> Ready to help</span>
            </div>
            <button className="ai-chat-icon-button" type="button" onClick={clearChat} title="Clear conversation" aria-label="Clear conversation">↻</button>
            <button className="ai-chat-icon-button" type="button" onClick={() => setIsOpen(false)} title="Minimize chat" aria-label="Minimize chat">−</button>
          </header>

          <div className="ai-chat-messages" aria-live="polite" aria-relevant="additions text">
            {messages.map((message, index) => (
              <div className={`ai-chat-row ${message.role === "user" ? "is-user" : "is-assistant"}`} key={`${index}-${message.role}`}>
                {message.role === "assistant" && <span className="ai-chat-avatar" aria-hidden="true">✦</span>}
                <div className="ai-chat-bubble">{message.text}</div>
              </div>
            ))}
            {loading && <div className="ai-chat-row is-assistant"><span className="ai-chat-avatar" aria-hidden="true">✦</span><div className="ai-chat-bubble ai-chat-typing"><span /><span /><span /><em>Thinking…</em></div></div>}
            <div ref={endRef} />
          </div>

          {error && <div className="ai-chat-error" role="alert"><strong>Couldn’t get a reply</strong><span>{error}</span></div>}

          <form className="ai-chat-compose" onSubmit={sendMessage}>
            <label className="ai-chat-sr-only" htmlFor="ai-chat-input">Your message</label>
            <textarea
              id="ai-chat-input"
              ref={inputRef}
              rows="1"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage(event);
                }
              }}
              placeholder="Ask me anything…"
              maxLength={4000}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message" title="Send message">➤</button>
          </form>
          <p className="ai-chat-footnote">AI can make mistakes. Don’t share passwords or sensitive information.</p>
        </section>
      )}
      <button className={`ai-chat-launcher ${isOpen ? "is-open" : ""}`} type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"} title="AI assistant">
        {isOpen ? "×" : <><span className="ai-chat-launcher-spark">✦</span><span className="ai-chat-launcher-label">Ask AI</span></>}
      </button>
    </div>
  );
}
