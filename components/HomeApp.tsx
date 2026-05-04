"use client";

import { Bell, Heart, Search, UserRound } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBanner } from "@/components/NotificationBanner";
import { ProfileCard } from "@/components/ProfileCard";
import { PremiumModal } from "@/components/PremiumModal";
import { AdSlot } from "@/components/AdSlot";
import type { Profile, PublicConfig } from "@/types";

const chips = ["All Online", "New", "Popular", "Verified"];

export function HomeApp({ profiles, config }: { profiles: Profile[]; config: PublicConfig }) {
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("All Online");
  const [premium, setPremium] = useState<{ type: "voice" | "video"; profile: Profile } | null>(null);
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const needle = deferredQuery.toLowerCase();
    return profiles.filter((profile) => {
      const matchesText = [profile.name, profile.bio, ...profile.tags].join(" ").toLowerCase().includes(needle);
      const matchesChip = activeChip === "All Online" ? profile.status === "online" : activeChip === "Verified" ? profile.verified : activeChip === "Popular" ? profile.rating >= 4.9 : true;
      return matchesText && matchesChip;
    });
  }, [activeChip, deferredQuery, profiles]);

  return (
    <main className="min-h-screen pb-24">
      <nav className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <div className="font-display text-3xl font-black gradient-text">{config.site_name}</div>
            <div className="hidden text-xs text-[var(--text2)] md:block">{config.site_tagline}</div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface2)]"><Bell size={18} />{config.notification_enabled ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-400" /> : null}</button>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface2)]"><UserRound size={18} /></button>
          </div>
        </div>
        <NotificationBanner enabled={config.notification_enabled} text={config.notification_text} />
      </nav>

      <section className="mx-auto max-w-7xl px-4 pt-8 md:pt-12">
        <div className="grid gap-6 md:grid-cols-[1fr_360px] md:items-end">
          <div>
            <p className="mb-3 w-max rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text2)]">{profiles.filter((profile) => profile.status === "online").length} online now</p>
            <h1 className="font-display text-5xl font-black leading-[.95] md:text-7xl">Meet someone who keeps the conversation alive.</h1>
          </div>
          <div className="glass rounded-[2rem] p-4">
            <label className="flex items-center gap-3 rounded-2xl bg-[var(--surface2)] px-4 py-3">
              <Search className="text-[var(--text2)]" size={19} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search profiles..." className="w-full bg-transparent outline-none placeholder:text-[var(--text2)]" />
            </label>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {chips.map((chip) => <button key={chip} onClick={() => setActiveChip(chip)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${activeChip === chip ? "border-transparent gradient-bg text-white" : "border-[var(--border)] bg-[var(--surface2)] text-[var(--text2)]"}`}>{chip}</button>)}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((profile) => <ProfileCard key={profile.id} profile={profile} onPremium={(type, selected) => setPremium({ type, profile: selected })} />)}
        </div>
      </section>

      <div className="fixed inset-x-4 bottom-20 z-20 mx-auto max-w-xl overflow-hidden rounded-2xl md:bottom-4"><AdSlot slot="social_bar" config={config} className="glass p-3 text-center text-sm text-[var(--text2)]" /></div>
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-[var(--border)] bg-[var(--bg)]/90 py-2 backdrop-blur md:hidden">
        {["Browse", "Likes", "Profile"].map((item) => <button key={item} className="grid place-items-center gap-1 text-xs text-[var(--text2)]"><Heart size={18} />{item}</button>)}
      </div>
      {premium ? <PremiumModal type={premium.type} profile={premium.profile} config={config} onClose={() => setPremium(null)} /> : null}
    </main>
  );
}
