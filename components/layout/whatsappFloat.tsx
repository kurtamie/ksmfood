"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { X, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/images/chara_bot.png";
import { whatsappLink } from "@/const/whatsapp";
import { VscRobot } from "react-icons/vsc";
import { useLocale } from "next-intl";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitialMessage(lang: "id" | "en"): Message {
  return {
    role: "assistant",
    content:
      lang === "en"
        ? "Hi! Vika here, KSM Catering Virtual Assistant 🍱\n\nVika is ready to help with menus, packages, and catering services. What can Vika help you with?"
        : "Halo! Vika di sini, Virtual Asisten KSM Katering 🍱\n\nVika siap membantu seputar menu, paket, dan layanan catering KSM. Ada yang bisa dibantu?",
    time: formatTime(new Date()),
  };
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
        <Image src="/images/chara_bot.png" alt="KSM Bot" className="w-full h-full object-cover" width={28} height={28} />
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2.5">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ role, content, time }: Message) {
  const isUser = role === "user";
  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {isUser ? (
        <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
          You
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
          <Image src="/images/chara_bot.png" alt="KSM Bot" className="w-full h-full object-cover" width={28} height={28} />
        </div>
      )}
      <div className={`max-w-[78%] group flex flex-col gap-0.5 ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
          isUser ? "bg-red-900 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}>
          {content}
        </div>
        <span className="text-[10px] text-gray-400 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {time}
        </span>
      </div>
    </div>
  );
}

export default function WhatsappFloat() {
  const locale = useLocale();
  const lang = locale === "en" ? "en" : "id";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([getInitialMessage(lang)]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasStartedRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!hasStartedRef.current) {
      setMessages([getInitialMessage(lang)]);
    }
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
    }
  }, [input]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  async function sendMessage(): Promise<void> {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    hasStartedRef.current = true;

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
      const apiMessages = updatedMessages.map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, lang }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, time: formatTime(new Date()) },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
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

  return (
    <div className="fixed right-4 bottom-4 z-60 flex items-end sm:right-6 sm:bottom-6">
      <div className="flex flex-col items-end gap-3">
        {isOpen && (
          <div
            className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/5 flex flex-col"
            style={{ height: "min(520px, calc(100vh - 7rem))" }}
          >
            <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3 flex-shrink-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#a90000]">
                <Image src={Logo} alt="KSM" className="object-cover rounded-full" width={46} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#2f3443]">Vika</p>
                <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                  Online
                </p>
              </div>
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25d366] text-white transition hover:bg-[#20ba59]"
                title={lang === "en" ? "Open WhatsApp" : "Buka WhatsApp"}
              >
                <FaWhatsapp className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-700"
                aria-label={lang === "en" ? "Close chat" : "Tutup popup"}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0">
              {messages.map((msg, i) => (
                <MessageBubble key={i} {...msg} />
              ))}
              {isLoading && <TypingIndicator />}
              {error && (
                <div className="text-center text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-3">
                  ⚠️ {error}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-100 px-3 py-2.5 flex-shrink-0">
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl flex items-end px-3 py-1.5 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={lang === "en" ? "Type a message..." : "Ketik pesan..."}
                    rows={1}
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 resize-none outline-none min-h-[20px] max-h-[100px] py-1 disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-full bg-red-800 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex size-16 items-center justify-center rounded-full bg-red-800 text-white shadow-[0_18px_40px_rgba(37,211,102,0.35)] transition hover:scale-[1.03] hover:bg-red-500"
          aria-expanded={isOpen}
          aria-label={isOpen ? (lang === "en" ? "Close chat" : "Tutup chat") : (lang === "en" ? "Open chat" : "Buka chat")}
        >
          {isOpen ? <X className="size-7" /> : <VscRobot className="size-9" />}
        </button>
      </div>
    </div>
  );
}