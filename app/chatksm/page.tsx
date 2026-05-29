"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

const MODEL_NAME = "KSM Catering Assistant";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        KSM
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ role, content, time }: Message) {
  const isUser = role === "user";
  return (
    <div
      className={`flex items-end gap-2 mb-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          You
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          KSM
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[75%] group flex flex-col gap-1 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-br-sm"
              : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
          }`}
        >
          {content}
        </div>
        <span className="text-[11px] text-gray-400 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {time}
        </span>
      </div>
    </div>
  );
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Halo! Selamat datang di KSM Catering 🍱\nSaya siap membantu Anda mendapatkan informasi seputar paket nasi kotak, prasmanan, menu, dan pemesanan. Ada yang bisa saya bantu?",
  time: formatTime(new Date()),
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
    }
  }, [input]);

  async function sendMessage(): Promise<void> {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: trimmed,
      time: formatTime(new Date()),
    };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const apiMessages = updatedMessages.map(({ role, content }) => ({
        role,
        content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        time: formatTime(new Date()),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      setMessages(messages);
      setInput(trimmed);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat(): void {
    setMessages([
      {
        role: "assistant",
        content: "Chat di-reset. Ada yang bisa saya bantu? 😊",
        time: formatTime(new Date()),
      },
    ]);
    setError(null);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            KSM
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-sm">
              {MODEL_NAME}
            </h1>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
              Online
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
        >
          Reset Chat
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-3xl w-full mx-auto">
        {messages.map((msg, i) => (
          <MessageBubble key={i} {...msg} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && (
          <div className="text-center text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
            ⚠️ {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl flex items-end px-4 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan... (Enter kirim, Shift+Enter baris baru)"
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none min-h-[24px] max-h-[150px] py-1 disabled:opacity-50"
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all hover:scale-105 active:scale-95 flex-shrink-0 mb-0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[11px] text-gray-400 mt-2 max-w-3xl mx-auto">
          KSM Catering · Muka Kuning, Batam · Berpengalaman sejak 2007 · Halal &
          Higiene
        </p>
      </div>
    </div>
  );
}