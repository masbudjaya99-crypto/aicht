import { getPublicConfig } from "@/lib/data";
import { AdminFrame } from "@/components/AdminFrame";

export default async function AdminAnalyticsPage() {
  const config = await getPublicConfig();
  return <AdminFrame><div><h1 className="font-display text-4xl font-black">Analytics</h1><form className="glass mt-6 grid gap-4 rounded-[2rem] p-5"><label className="grid gap-2 text-sm text-[var(--text2)]">GA4 Measurement ID<input name="ga4_measurement_id" defaultValue={config.ga4_measurement_id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label><label className="flex items-center gap-2 text-sm text-[var(--text2)]"><input name="ga4_enabled" type="checkbox" defaultChecked={config.ga4_enabled} /> Enable GA4</label><button formAction="/api/admin/config" formMethod="post" className="rounded-2xl gradient-bg px-4 py-3 font-bold text-white">Save analytics</button></form></div></AdminFrame>;
}
