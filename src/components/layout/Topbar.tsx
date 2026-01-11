"use client";

import clsx from "clsx";
import { Users, CheckCircle2, Mail, MessageCircle, Phone } from "lucide-react";

const CircleAction = ({
  children,
  bgClass,
  label,
}: {
  children: React.ReactNode;
  bgClass: string;
  label: string;
}) => (
  <button
    aria-label={label}
    className={clsx(
      "grid h-8 w-8 place-items-center rounded-full text-white shadow-sm transition",
      "hover:opacity-90 active:scale-[0.98]",
      bgClass
    )}
  >
    {children}
  </button>
);

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
      {/* Left: Title */}
      <div className="flex items-center gap-2">
        <Users size={18} className="text-text" />
        <h1 className="text-base font-semibold text-text">Inquiries</h1>
      </div>

      {/* Right: Circular actions */}
      <div className="flex items-center gap-2">
        <CircleAction bgClass="bg-pink-500" label="Tasks">
          <CheckCircle2 size={16} />
        </CircleAction>

        <CircleAction bgClass="bg-blue-500" label="Mail">
          <Mail size={16} />
        </CircleAction>

        <CircleAction bgClass="bg-emerald-500" label="Chat">
          <MessageCircle size={16} />
        </CircleAction>

        <CircleAction bgClass="bg-violet-500" label="Call">
          <Phone size={16} />
        </CircleAction>
      </div>
    </header>
  );
}
