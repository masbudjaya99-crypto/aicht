import { getProfiles, getPublicConfig } from "@/lib/data";
import { AdminFrame } from "@/components/AdminFrame";

export default async function AdminPage() {
  const [profiles, config] = await Promise.all([getProfiles(true), getPublicConfig()]);
  const stats = [
    ["Active profiles", profiles.filter((profile) => profile.active !== false).length],
    ["Chat sessions today", "Supabase"],
    ["Messages today", "Supabase"],
    ["AI provider", config.ai_provider || "openai"]
  ];
  return <AdminFrame><div><h1 className="font-display text-4xl font-black">Overview</h1><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value]) => <div key={label} className="glass rounded-[1.5rem] p-5"><div className="text-sm text-[var(--text2)]">{label}</div><div className="mt-2 font-display text-3xl font-bold">{value}</div></div>)}</div></div></AdminFrame>;
}
