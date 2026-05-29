"use client";

// QuickReplyBar.tsx
// Pill buttons yang muncul di bawah pesan bot
// Klik = kirim `value` sebagai pesan user ke AI

import { QuickReply, QuickReplyGroup } from "@/components/layout/Quickreplies"

interface QuickReplyBarProps {
  group: QuickReplyGroup;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

const variantClass: Record<string, string> = {
  default: "border-violet-500 text-violet-600 hover:bg-violet-500 hover:text-white",
  green:   "border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white",
  orange:  "border-orange-400 text-orange-500 hover:bg-orange-400 hover:text-white",
  blue:    "border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white",
};

function Pill({
  reply,
  onSelect,
  disabled,
}: {
  reply: QuickReply;
  onSelect: (value: string) => void;
  disabled?: boolean;
}) {
  const cls = variantClass[reply.variant ?? "default"];
  return (
    <button
      onClick={() => !disabled && onSelect(reply.value)}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1
        border-[1.5px] rounded-full
        px-3 py-1.5 text-xs font-semibold
        bg-white transition-all duration-150 select-none
        ${cls}
        ${disabled
          ? "opacity-40 cursor-not-allowed"
          : "cursor-pointer active:scale-95 hover:shadow-sm"}
      `}
    >
      {reply.label}
    </button>
  );
}

export default function QuickReplyBar({
  group,
  onSelect,
  disabled = false,
}: QuickReplyBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2 pl-10">
      {group.replies.map((r) => (
        <Pill key={r.value} reply={r} onSelect={onSelect} disabled={disabled} />
      ))}
    </div>
  );
}