import Image from "next/image";
import { AdminFrame } from "@/components/AdminFrame";
import { getProfiles } from "@/lib/data";

export default async function AdminProfilesPage() {
  const profiles = await getProfiles(true);
  return <AdminFrame><div><h1 className="font-display text-4xl font-black">Profiles</h1><div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[var(--border)]">{profiles.map((profile) => <div key={profile.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-4 border-b border-[var(--border)] bg-[var(--surface)] p-4 last:border-b-0"><Image src={profile.photo_url} alt={profile.name} width={56} height={56} className="h-14 w-14 rounded-2xl object-cover" /><div><div className="font-bold">{profile.name}</div><div className="text-sm text-[var(--text2)]">{profile.status} · sort {profile.sort_order ?? 0}</div></div><span className="rounded-full bg-[var(--surface2)] px-3 py-1 text-xs text-[var(--text2)]">{profile.active === false ? "Hidden" : "Active"}</span></div>)}</div></div></AdminFrame>;
}
