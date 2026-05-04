"use client";

import { X } from "lucide-react";
import { useState } from "react";

export function NotificationBanner({ text, enabled }: { text: string; enabled: boolean }) {
  const [hidden, setHidden] = useState(false);
  if (!enabled || hidden) return null;

  return (
    <div className="gradient-bg relative overflow-hidden py-2 text-sm font-bold text-white">
      <div className="animate-marquee whitespace-nowrap">{text}</div>
      <button onClick={() => setHidden(true)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-1" aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
}
