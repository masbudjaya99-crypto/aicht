"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, Star, Video } from "lucide-react";
import type { Profile } from "@/types";

export function ProfileCard({ profile, onPremium }: { profile: Profile; onPremium: (type: "voice" | "video", profile: Profile) => void }) {
  return (
    <article className="group glass overflow-hidden rounded-[1.7rem] transition duration-300 hover:-translate-y-1.5 hover:border-white/20">
      <Link href={`/chat/${profile.id}`} className="relative block aspect-[4/5] overflow-hidden min-[430px]:aspect-[3/4]">
        <Image src={profile.photo_url} alt={profile.name} fill className="object-cover transition duration-700 group-hover:scale-110" sizes="(max-width: 430px) 100vw, (max-width: 768px) 50vw, 20vw" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-white sm:p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold"><span className={`h-2.5 w-2.5 rounded-full ${profile.status === "online" ? "animate-pulseDot bg-[var(--online)]" : "bg-amber-400"}`} />{profile.status === "online" ? "Online" : "Away"}{profile.verified ? <span className="rounded-full bg-violet-500 px-1.5">✓</span> : null}</div>
          <h3 className="font-display text-xl font-bold sm:text-2xl">{profile.name}</h3>
          <div className="flex items-center gap-1 text-sm text-white/80">{profile.age} · <Star size={14} className="fill-pink-300 text-pink-300" /> {profile.rating.toFixed(1)}</div>
        </div>
      </Link>
      <div className="space-y-3 p-3 md:p-4">
        <div className="flex flex-wrap gap-1.5">{profile.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-[var(--surface2)] px-2.5 py-1 text-[11px] text-[var(--text2)]">{tag}</span>)}</div>
        <p className="line-clamp-2 min-h-10 text-sm text-[var(--text2)]">{profile.bio}</p>
        <div className="grid grid-cols-[1fr_44px_44px] gap-2">
          <Link href={`/chat/${profile.id}`} className="flex min-h-11 items-center justify-center gap-1 rounded-2xl gradient-bg px-3 py-2.5 text-sm font-bold text-white"><MessageCircle size={16} /> Chat</Link>
          <button onClick={() => onPremium("voice", profile)} className="grid min-h-11 place-items-center rounded-2xl bg-[var(--surface2)]"><Phone size={16} /></button>
          <button onClick={() => onPremium("video", profile)} className="grid min-h-11 place-items-center rounded-2xl bg-[var(--surface2)]"><Video size={16} /></button>
        </div>
      </div>
    </article>
  );
}
