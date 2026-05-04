import { getPublicConfig } from "@/lib/data";
import { AdminFrame } from "@/components/AdminFrame";

export default async function AdminAdsPage() {
  const config = await getPublicConfig();
  return <AdminFrame><div><h1 className="font-display text-4xl font-black">Ad Configuration</h1><form className="mt-6 grid gap-4">{Object.entries(config.ads).map(([slot, ad]) => <div key={slot} className="glass rounded-[1.5rem] p-5"><div className="mb-3 font-display text-xl font-bold">{slot}</div><label className="mb-3 flex items-center gap-2 text-sm text-[var(--text2)]"><input name={`${slot}:enabled`} type="checkbox" defaultChecked={ad.enabled} /> Enabled</label><textarea name={`${slot}:code`} defaultValue={ad.code} rows={4} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface2)] p-3 text-sm outline-none" /></div>)}<button formAction="/api/admin/ads" formMethod="post" className="rounded-2xl gradient-bg px-4 py-3 font-bold text-white">Save ad slots</button></form></div></AdminFrame>;
}
