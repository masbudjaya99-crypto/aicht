import { getPublicConfig } from "@/lib/data";
import { AdminFrame } from "@/components/AdminFrame";

export default async function AdminAiPage() {
  const config = await getPublicConfig();
  return <AdminFrame><div><h1 className="font-display text-4xl font-black">AI Configuration</h1><form className="glass mt-6 grid gap-4 rounded-[2rem] p-5">{[["ai_provider", config.ai_provider], ["ai_base_url", config.ai_base_url], ["ai_model", config.ai_model]].map(([name, value]) => <label key={name} className="grid gap-2 text-sm text-[var(--text2)]">{name}<input name={name} defaultValue={value} className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label>)}<label className="grid gap-2 text-sm text-[var(--text2)]">ai_api_key<input name="ai_api_key" type="password" placeholder="Hidden after saving" className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label><button formAction="/api/admin/ai" formMethod="post" className="rounded-2xl gradient-bg px-4 py-3 font-bold text-white">Save AI config</button></form></div></AdminFrame>;
}
