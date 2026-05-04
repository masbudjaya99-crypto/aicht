"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MoreVertical, Paperclip, Send, Smile } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdSlot } from "@/components/AdSlot";
import { GlobalAds } from "@/components/GlobalAds";
import { LimitModal } from "@/components/LimitModal";
import type { ChatMessage, LimitStatus, Profile, PublicConfig } from "@/types";

function getFingerprint() {
  if (typeof window === "undefined") return "anonymous";
  const key = "flique_fingerprint";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem(key, next);
  return next;
}

export function ChatApp({ profile, config }: { profile: Profile; config: PublicConfig }) {
  const [fingerprint, setFingerprint] = useState("anonymous");
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [limit, setLimit] = useState<LimitStatus>({ messages_sent: 0, free_limit: config.chat_free_limit, bonus_messages: 0, total_allowed: config.chat_free_limit, remaining: config.chat_free_limit, reset_at: new Date().toISOString() });
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: "greeting", role: "assistant", content: `Hi, I'm ${profile.name}. I was hoping someone interesting would say hello today.`, created_at: new Date().toISOString() }]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const claimedOnce = limit.bonus_messages > 0;
  const disabled = limit.remaining <= 0;

  useEffect(() => {
    const fp = getFingerprint();
    setFingerprint(fp);
    fetch(`/api/limit?fp=${encodeURIComponent(fp)}`).then((response) => response.json()).then(setLimit);
  }, []);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, typing]);

  const progress = useMemo(() => Math.max(0, Math.min(100, (limit.remaining / Math.max(1, limit.total_allowed)) * 100)), [limit]);

  async function send() {
    if (!text.trim() || disabled) return;
    const content = text.trim();
    setText("");
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content, created_at: new Date().toISOString() };
    setMessages((current) => [...current, userMessage]);
    setTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500));
    const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile_id: profile.id, fingerprint, message: content, history: messages }) });
    const json = await response.json();
    setTyping(false);
    if (json.limit) setLimit(json.limit);
    if (!response.ok) return;
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: json.reply, created_at: new Date().toISOString() }]);
    if (json.limit?.remaining === 0 && !json.limit?.bonus_messages) setShowClaim(true);
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <header className="z-20 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-2 py-2.5 sm:gap-3 sm:px-3 sm:py-3">
          <Link href="/" className="grid h-10 w-10 place-items-center rounded-full bg-[var(--surface2)]"><ArrowLeft size={18} /></Link>
          <Image src={profile.photo_url} alt={profile.name} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
          <div className="min-w-0 flex-1"><div className="truncate font-display text-lg font-bold sm:text-xl">{profile.name}</div><div className="text-xs text-[var(--text2)]"><span className="text-[var(--online)]">●</span> {profile.status === "online" ? "Online" : "Away"}</div></div>
          <ThemeToggle />
          <button className="grid h-10 w-10 place-items-center rounded-full bg-[var(--surface2)]"><MoreVertical size={18} /></button>
        </div>
        <AdSlot slot="banner_top" config={config} className="max-h-20 overflow-hidden border-t border-[var(--border)] bg-[var(--surface)] p-1.5 text-center text-xs text-[var(--text2)] sm:p-2 sm:text-sm" />
      </header>

      <section className="flex-1 overflow-y-auto px-2 py-3 sm:px-3 sm:py-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {messages.map((message, index) => (
            <div key={message.id}>
              {index > 0 && index % config.messages_per_ad === 0 ? <div className="my-4 rounded-3xl border border-dashed border-[var(--border)] p-2"><div className="mb-1 text-xs text-[var(--text2)]">Sponsored</div><AdSlot slot="native_in_chat" config={config} className="text-sm text-[var(--text2)]" /></div> : null}
              <div className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm shadow-lg sm:max-w-[82%] ${message.role === "user" ? "ml-auto rounded-br-md gradient-bg text-white" : "rounded-bl-md bg-[var(--surface)] text-[var(--text)]"}`}>{message.content}<div className="mt-1 text-[10px] opacity-60">{new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div></div>
            </div>
          ))}
          {typing ? <div className="w-max rounded-3xl rounded-bl-md bg-[var(--surface)] px-4 py-3 text-[var(--text2)]">● ● ●</div> : null}
          <div ref={bottomRef} />
        </div>
      </section>

      <footer className="border-t border-[var(--border)] bg-[var(--bg)]/90 p-2 backdrop-blur-xl sm:p-3">
        <AdSlot slot="social_bar" config={config} className="mb-2 max-h-20 overflow-hidden rounded-2xl bg-[var(--surface)] p-1.5 text-center text-xs text-[var(--text2)] sm:p-2 sm:text-sm" />
        <div className="mx-auto max-w-3xl">
          <div className="mb-2 flex items-center gap-3 text-xs text-[var(--text2)]"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface2)]"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-yellow-300 to-pink-500" style={{ width: `${progress}%` }} /></div>{limit.remaining}/{limit.total_allowed} remaining</div>
          <div className="flex items-end gap-2 rounded-3xl bg-[var(--surface)] p-2">
            <button className="grid h-10 w-10 place-items-center rounded-full text-[var(--text2)]"><Smile size={20} /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full text-[var(--text2)]"><Paperclip size={20} /></button>
            <textarea value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} placeholder="Type a message..." rows={1} className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 outline-none placeholder:text-[var(--text2)]" />
            <button onClick={send} disabled={disabled} className="grid h-11 w-11 place-items-center rounded-full gradient-bg text-white disabled:cursor-not-allowed disabled:opacity-40"><Send size={18} /></button>
          </div>
        </div>
      </footer>
      <GlobalAds config={config} />
      {showClaim && !claimedOnce ? <LimitModal config={config} fingerprint={fingerprint} onClaimed={() => { setShowClaim(false); fetch(`/api/limit?fp=${encodeURIComponent(fingerprint)}`).then((response) => response.json()).then(setLimit); }} /> : null}
    </main>
  );
}
