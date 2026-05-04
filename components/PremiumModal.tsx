"use client";

import { Phone, Video, X } from "lucide-react";
import type { Profile, PublicConfig } from "@/types";

export function PremiumModal({ type, profile, config, onClose }: { type: "voice" | "video"; profile: Profile; config: PublicConfig; onClose: () => void }) {
  const isVideo = type === "video";
  const redirect = isVideo ? config.video_call_redirect : config.voice_call_redirect;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-lg">
      <div className="glass relative w-full max-w-md overflow-hidden rounded-[2rem] p-7 text-center">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-[var(--surface2)] p-2 text-[var(--text2)]"><X size={16} /></button>
        <div className="mx-auto mb-5 grid h-20 w-20 animate-float place-items-center rounded-full gradient-bg text-white">{isVideo ? <Video size={34} /> : <Phone size={34} />}</div>
        <h2 className="font-display text-3xl font-bold">Unlock {isVideo ? "Video" : "Voice"} Call</h2>
        <p className="mt-2 text-[var(--text2)]">Start a more personal moment with {profile.name} when you activate this feature.</p>
        <div className="my-6 grid gap-2 text-left text-sm text-[var(--text2)]">
          {["Private high-quality calls", "Priority connection access", "One-tap secure redirect", "Works on mobile and desktop"].map((item) => <div key={item} className="rounded-2xl bg-[var(--surface2)] px-4 py-3">✓ {item}</div>)}
        </div>
        <button onClick={() => window.open(redirect, "_blank")} className="w-full rounded-2xl gradient-bg px-5 py-4 font-bold text-white shadow-glow">Aktifkan Fitur Ini</button>
        <button onClick={onClose} className="mt-4 text-sm text-[var(--text2)]">Nanti saja</button>
      </div>
    </div>
  );
}
